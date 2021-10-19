import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnection } from 'typeorm';

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
	let jwtToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
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
					console.log(res.body);
					expect(res.body.data.createAccount.ok).toBe(true);
					expect(res.body.data.createAccount.error).toBe(null);
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
					expect(res.body.data.createAccount.ok).toBe(false);
					expect(res.body.data.createAccount.error).toBe(
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

	it.todo('userProfile');
	it.todo('me');
	it.todo('verifyEmail');
	it.todo('editProfile');
});