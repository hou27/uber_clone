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

	@Mutation((returns) => CreateAccountOutput)
	createAccount(@Args('input') createAccountInput: CreateAccountInput) {}
}