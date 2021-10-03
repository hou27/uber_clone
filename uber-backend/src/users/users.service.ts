import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly users: Repository<User>,
		// private readonly config: ConfigService,
		/** Dependency Injection
		 * app.module에서 Global로 ConfigModule을 import했으므로
		 * users.module에서 다시 import해줄 필요 x
		 */
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
			await this.users.save(this.users.create({ email, password, role }));
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
}