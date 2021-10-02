import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';

@Resolver((of) => User)
export class UserResolver {
	constructor(private readonly usersService: UserService) {}

	@Query((returns) => Boolean)
	rootQuery() {
		return true;
	}

	@Query((returns) => [User])
	users(): Promise<User[]> {
		return this.usersService.getAll();
	}
	
	@Mutation((returns) => CreateAccountOutput)
	async createAccount(
		@Args('input') createAccountInput: CreateAccountInput
	): Promise<CreateAccountOutput> {
		try {
			const error = await this.usersService.createAccount(createAccountInput);
			if (error) {
				return {
					ok: false,
					error,
				};
			}
			return {
				ok: true,
			};
		} catch (error) {
			return {
				error,
				ok: false,
			};
		}
	}
}