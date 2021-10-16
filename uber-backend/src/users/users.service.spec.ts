import { Test } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';

const mockRepository = () => ({
	// make as a function type that returns Object.
	// fake for Unit Test
	findOne: jest.fn(), // create Mock Func
	save: jest.fn(),
	create: jest.fn(),
	findOneOrFail: jest.fn(),
});

const mockJwtService = () => ({
	sign: jest.fn(() => 'faked-token'),
	verify: jest.fn(),
});

const mockMailService = () => ({
	sendVerificationEmail: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

/** Typescript things
 *
 * type Partial<T> = { [P in keyof T]?: T [P]; }
 * Partial : Make all properties in T optional.
 *
 * type Record<K extends string | number | symbol, T> = { [P in K]: T; }
 * Record : Construct a type with a set of properties K of type T.
 *
 */

describe('UserService', () => {
	let service: UserService;
	let usersRepository: MockRepository<User>;
	let verificationsRepository: MockRepository<Verification>;
	let mailService: MailService;
	let jwtService: JwtService;

	/*beforeAll*/ beforeEach(async () => {
		// now this test module is recreated before each test.
		// The number of function calls no longer remains in jest's memory.
		const module = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getRepositoryToken(User),
					useValue: mockRepository(),
				},
				{
					provide: getRepositoryToken(Verification),
					useValue: mockRepository(),
				},
				{
					provide: JwtService,
					useValue: mockJwtService(),
				},
				{
					provide: MailService,
					useValue: mockMailService(),
				},
			],
		}).compile();
		service = module.get<UserService>(UserService);
		usersRepository = module.get(getRepositoryToken(User));
		mailService = module.get<MailService>(MailService);
		verificationsRepository = module.get(getRepositoryToken(Verification));
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('createAccount', () => {
		const createAccountArgs = {
			email: '',
			password: '',
			role: 0,
		};

		it('should fail if user exists', async () => {
			// mockResolvedValue is like Promise.resolve(value)
			usersRepository.findOne.mockResolvedValue({
				// findOne returns this value below
				id: 1,
				email: 'fake value',
			});
			const result = await service.createAccount(createAccountArgs);
			expect(result).toMatchObject({
				ok: false,
				error: 'There is a user with that email already',
			});
		});

		it('should create a new user', async () => {
			usersRepository.findOne.mockResolvedValue(undefined);
			usersRepository.create.mockReturnValue(createAccountArgs);
			usersRepository.save.mockResolvedValue(createAccountArgs);

			verificationsRepository.create.mockReturnValue({
				user: createAccountArgs,
			});
			verificationsRepository.save.mockResolvedValue({
				code: 'code',
			});

			const result = await service.createAccount(createAccountArgs);

			expect(usersRepository.create).toHaveBeenCalledTimes(1);
			/*
			 * Jest can't know User and Verification Repository are different.
			 * because object in js is a reference type.
			 *
			 * so make mockRepository as a func type that returns OBJ.
			 */
			expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

			expect(usersRepository.save).toHaveBeenCalledTimes(1);
			expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

			expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
			expect(verificationsRepository.create).toHaveBeenCalledWith({
				user: createAccountArgs,
			});

			expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
			expect(verificationsRepository.save).toHaveBeenCalledWith({
				user: createAccountArgs,
			});

			expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
			expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String)
			);
			expect(result).toEqual({ ok: true });
		});

		it('should fail on exception', async () => {
			usersRepository.findOne.mockRejectedValue(new Error()); // make await fail.
			const result = await service.createAccount(createAccountArgs);
			expect(result).toEqual({ ok: false, error: "Couldn't create account" });
		});
	});

	describe('login', () => {
		const loginArgs = {
			email: 'fake@email.com',
			password: 'fake.password',
		};

		it('should fail if user does not exist', async () => {
			usersRepository.findOne.mockResolvedValue(null); // for Promise method

			const result = await service.login(loginArgs);

			expect(usersRepository.findOne).toHaveBeenCalledTimes(1); // beforeAll -> beforeEach
			expect(usersRepository.findOne).toHaveBeenCalledWith(
				expect.any(Object),
				expect.any(Object)
			);
			expect(result).toEqual({
				ok: false,
				error: 'User not found',
			});
		});

		it('should fail if the password is wrong', async () => {
			const mockedUser = {
				checkPassword: jest.fn(() => Promise.resolve(false)), // mock func that returns Promise.
			};
			usersRepository.findOne.mockResolvedValue(mockedUser);
			const result = await service.login(loginArgs);
			expect(result).toEqual({ ok: false, error: 'Wrong password' });
		});

		it('should return token if password correct', async () => {
			const mockedUser = {
				id: 1,
				checkPassword: jest.fn(() => Promise.resolve(true)),
			};
			usersRepository.findOne.mockResolvedValue(mockedUser);
			const result = await service.login(loginArgs);
			// console.log(result);
			expect(jwtService.sign).toHaveBeenCalledTimes(1);
			expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
			expect(result).toEqual({ ok: true, token: 'faked-token' });
		});

		it('should fail on exception', async () => {
			usersRepository.findOne.mockRejectedValue(new Error());
			const result = await service.login(loginArgs);
			expect(result).toEqual({ ok: false, error: "Can't log user in." });
		});
	});

	describe('findById', () => {
		const findByIdArgs = {
			id: 1,
		};
		it('should find an existing user', async () => {
			usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
			const result = await service.findById(1);
			expect(result).toEqual({ ok: true, user: findByIdArgs });
		});

		it('should fail if no user is found', async () => {
			usersRepository.findOneOrFail.mockRejectedValue(new Error());
			const result = await service.findById(1);
			expect(result).toEqual({ ok: false, error: 'User Not Found' });
		});
	});

	describe('editProfile', () => {
		it('should change email', async () => {
			const oldUser = {
				email: 'fake@old.com',
				verified: true,
			};
			const editProfileArgs = {
				userId: 1,
				input: { email: 'fake@new.com' },
			};
			const newVerification = {
				code: 'code',
			};
			const newUser = {
				verified: false,
				email: editProfileArgs.input.email,
			};

			// mocking
			usersRepository.findOne.mockResolvedValue(oldUser);
			verificationsRepository.create.mockReturnValue(newVerification);
			verificationsRepository.save.mockResolvedValue(newVerification);

			// testing
			const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

			// expecting
			expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
			expect(usersRepository.findOne).toHaveBeenCalledWith(editProfileArgs.userId);

			expect(verificationsRepository.create).toHaveBeenCalledWith({
				user: newUser,
			});
			expect(verificationsRepository.save).toHaveBeenCalledWith(newVerification);

			expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
			expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
				newUser.email,
				newVerification.code
			);
			
			expect(result).toEqual({ ok: true });
		});

		it('should change password', async () => {
			const editProfileArgs = {
				userId: 1,
				input: { password: 'new.password' },
			};
			usersRepository.findOne.mockResolvedValue({ password: 'old.password' });
			const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
			expect(usersRepository.save).toHaveBeenCalledTimes(1);
			expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
			expect(result).toEqual({ ok: true });
		});

		it('should fail on exception', async () => {
			usersRepository.findOne.mockRejectedValue(new Error());
			const result = await service.editProfile(1, { email: 'fakeEmail' });
			expect(result).toEqual({ ok: false, error: 'Could not update profile.' });
		});
	});

	it.todo('verifyEmail');
});