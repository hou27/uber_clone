import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

const GRAPHQL_ENDPOINT = '/graphql';
const testUser = {
	email: 'jalapeno@hou.com',
	password: '12345',
};

jest.mock('got', () => {
	return {
		post: jest.fn(),
	};
});

describe('UserModule (e2e)', () => {
	let app: INestApplication;
	let usersRepository: Repository<User>;

	let jwtToken: string;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = module.createNestApplication();
		/*
		(method) NestApplicationContext.get<any, Repository<User>>(typeOrToken: string | symbol | Type<any> | Abstract<any>, options?: {
			strict: boolean;
		}): Repository<User>
		*/
		usersRepository = module.get<Repository<User>>(getRepositoryToken(User)); // can get type or token.
		await app.init();
	});

	afterAll(async () => {
		// drop the DB after all the test have been completed.
		await getConnection().dropDatabase();
		// fix err 'Jest did not exit one second after the test run has completed.'
		app.close();
	});

	describe('createAccount', () => {
		it('should create account', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `
					  mutation {
						createAccount(input: {
						  email:"${testUser.email}",
               			  password:"${testUser.password}",
						  role:Owner
						}) {
						  ok
						  error
						}
					  }
					`,
				})
				.expect(200)
				.expect((res) => {
					const { ok, error } = res.body.data.createAccount;
					expect(ok).toBe(true);
					expect(error).toBe(null);
				});
		});

		it('should fail if account already exists', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `
					  mutation {
						createAccount(input: {
						  email:"${testUser.email}",
              			  password:"${testUser.password}",
						  role:Owner
						}) {
						  ok
						  error
						}
					  }
					`,
				})
				.expect(200)
				.expect((res) => {
					const { ok, error } = res.body.data.createAccount;
					expect(ok).toBe(false);
					expect(error).toBe(
						'There is a user with that email already'
					);
				});
		});
	});

	describe('login', () => {
		it('should login with correct credentials', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `
				  mutation {
					login(input:{
					  email:"${testUser.email}",
					  password:"${testUser.password}",
					}) {
					  ok
					  error
					  token
					}
				  }
				`,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: {
							data: { login },
						},
					} = res;
					const { ok, error, token } = login;
					expect(ok).toBe(true);
					expect(error).toBe(null);
					expect(token).toEqual(expect.any(String));
					jwtToken = login.token;
				});
		});
		it('should not be able to login with wrong credentials', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `
				  mutation {
					login(input:{
					  email:"${testUser.email}",
					  password:"wrong_pw",
					}) {
					  ok
					  error
					  token
					}
				  }
				`,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: {
							data: { login },
						},
					} = res;
					const { ok, error, token } = login;
					expect(ok).toBe(false);
					expect(error).toBe('Wrong password');
					expect(token).toBe(null);
				});
		});
	});

	describe('userProfile', () => {
		let userId: number;
		beforeAll(async () => {
			const [user] = await usersRepository.find();
			userId = user.id;
		});

		it("should see a user's profile", () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.set('X-JWT', jwtToken) // set header after post
				.send({
					query: `
					{
					  userProfile(userId:${userId}){
						ok
						error
						user {
						  id
						}
					  }
					}
					`,
				})
				.expect(200)
				.expect((res) => {
					// const {
					// 	body: {
					// 		data: {
					// 			userProfile: {
					// 				ok,
					// 				error,
					// 				user: { id },
					// 			},
					// 		},
					// 	},
					// } = res;
					const {
						ok,
						error,
						user: { id },
					} = res.body.data.userProfile;
					expect(ok).toBe(true);
					expect(error).toBe(null);
					expect(id).toBe(userId);
				});
		});
		it('should not find a profile', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.set('X-JWT', jwtToken)
				.send({
					query: `
					{
					  userProfile(userId:321){
						ok
						error
						user {
						  id
						}
					  }
					}
					`,
				})
				.expect(200)
				.expect((res) => {
					const { ok, error, user } = res.body.data.userProfile;
					expect(ok).toBe(false);
					expect(error).toBe('User Not Found');
					expect(user).toBe(null);
				});
		});
	});

	describe('me', () => {
		it('should find my profile', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.set('X-JWT', jwtToken)
				.send({
					query: `
					{
					  me {
						email
					  }
					}
				  `,
				})
				.expect(200)
				.expect((res) => {
					const { email } = res.body.data.me;
					expect(email).toBe(testUser.email);
				});
		});
		it('should not allow logged out user', () => {
			return request(app.getHttpServer())
				.post(GRAPHQL_ENDPOINT)
				.send({
					query: `
					{
					  me {
						email
					  }
					}
				  `,
				})
				.expect(200)
				.expect((res) => {
					const {
						body: { errors },
					} = res;
					const [error] = errors;
					expect(error.message).toBe('Forbidden resource');
				});
		});
	});

	it.todo('verifyEmail');
	it.todo('editProfile');
});