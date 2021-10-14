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
});

const mockJwtService = {
	sign: jest.fn(),
	verify: jest.fn(),
};

const mockMailService = {
	sendVerificationEmail: jest.fn(),
};

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

	beforeAll(async () => {
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
					useValue: mockJwtService,
				},
				{
					provide: MailService,
					useValue: mockMailService,
				},
			],
		}).compile();
		service = module.get<UserService>(UserService);
		usersRepository = module.get(getRepositoryToken(User));
		mailService = module.get<MailService>(MailService);
		verificationsRepository = module.get(getRepositoryToken(Verification));
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

	it.todo('login');
	it.todo('findById');
	it.todo('editProfile');
	it.todo('verifyEmail');
});