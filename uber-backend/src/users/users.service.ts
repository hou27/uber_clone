import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly users: Repository<User>,
		@InjectRepository(Verification)
		private readonly verifications: Repository<Verification>,
		private readonly jwtService: JwtService
	) {}

	getAll(): Promise<User[]> {
		return this.users.find();
	}

	async createAccount({
		email,
		password,
		role,
	}: CreateAccountInput): Promise<CreateAccountOutput /*{ ok: boolean; error?: string }*/> {
		try {
			const exists = await this.users.findOne({ email });
			if (exists) {
				return { ok: false, error: 'There is a user with that email already' };
			}
			const user = await this.users.save(this.users.create({ email, password, role }));

			await this.verifications.save(this.verifications.create({ user }));

			return { ok: true };
		} catch (e) {
			return { ok: false, error: "Couldn't create account" };
		}
	}

	async login({
		email,
		password,
	}: LoginInput): Promise<LoginOutput /*{ ok: boolean; error?: string; token?: string }*/> {
		// make a JWT and give it to the user
		try {
			const user = await this.users.findOne({ email });
			if (!user) {
				return {
					ok: false,
					error: 'User not found',
				};
			}
			const passwordCorrect = await user.checkPassword(password);
			if (!passwordCorrect) {
				return {
					ok: false,
					error: 'Wrong password',
				};
			}
			const token = this.jwtService.sign(
				user.id
				/*{ id: user.id }*/
			);
			// const token = jwt.sign(
			// 	{ id: user.id },
			// 	this.config.get('SECRET_KEY') /* process.env.SECRET_KEY */
			// );
			return {
				ok: true,
				token,
			};
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}

	async findById(id: number): Promise<User> {
		return this.users.findOne({ id });
	}

	async editProfile(userId: number, { email, password }: EditProfileInput): Promise<User> {
		// return this.users.update(userId, { ...editProfileInput });
		// TypeORM - update : Doesn't check if entity exist in the db.
		// --------- just send a query to db. (update entity X)
		// -> can't call BeforeUpdate Hook.

		// resolve -> use save().
		const user = await this.users.findOne(userId);

		if (email) {
			user.email = email;
			user.verified = false;
			await this.verifications.save(this.verifications.create({ user }));
		}
		password ? (user.password = password) : null;

		return this.users.save(user);
	}

	async verifyEmail(code: string): Promise<boolean> {
		const verification = await this.verifications.findOne(
			{ code }, // get relation id
			/*{ loadRelationIds: true }*/
			{ relations: ['user'] } // what relation you want to actually load
		);
		if (verification) {
			verification.user.verified = true;
			this.users.save(verification.user);
		}
		return false;
	}
}