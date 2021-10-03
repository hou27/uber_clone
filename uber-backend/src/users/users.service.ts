import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly users: Repository<User>
	) {}

	getAll(): Promise<User[]> {
		return this.users.find();
	}

	async createAccount({
		email,
		password,
		role,
	}: CreateAccountInput): Promise<{ ok: boolean; err?: string }> {
		try {
			const exists = await this.users.findOne({ email });
			if (exists) {
				return { ok: false, err: 'There is a user with that email already' };
			}
			await this.users.save(this.users.create({ email, password, role }));
			return { ok: true };
		} catch (e) {
			return { ok: false, err: "Couldn't create account" };
		}
	}
}