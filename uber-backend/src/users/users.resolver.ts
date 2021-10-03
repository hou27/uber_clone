import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';

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
			const { ok, error } = await this.usersService.createAccount(createAccountInput);
			return {
				ok,
				error,
			};
		} catch (error) {
			return {
				error,
				ok: false,
			};
		}
	}

	@Mutation((returns) => LoginOutput)
	async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
		try {
			return this.usersService.login(loginInput);
		} catch (error) {
			return {
				ok: false,
				error,
			};
		}
	}
}