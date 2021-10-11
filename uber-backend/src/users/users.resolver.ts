import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';

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
		return this.usersService.createAccount(createAccountInput);
	}

	@Mutation((returns) => LoginOutput)
	async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
		return this.usersService.login(loginInput);
	}

	@Query((returns) => User)
	@UseGuards(AuthGuard)
	me(@AuthUser() authUser: User) {
		// decorator has to return value
		return authUser;
	}

	@UseGuards(AuthGuard)
	@Query((returns) => UserProfileOutput)
	async userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
		return this.usersService.findById(userProfileInput.userId);
	}

	
	@Mutation((returns) => EditProfileOutput)
	@UseGuards(AuthGuard)
	async editProfile(
		@AuthUser() authUser: User,
		@Args('input') editProfileInput: EditProfileInput
	): Promise<EditProfileOutput> {
		return this.usersService.editProfile(authUser.id, editProfileInput);
	}

	@Mutation((returns) => VerifyEmailOutput)
	verifyEmail(@Args('input') { code }: VerifyEmailInput): Promise<VerifyEmailOutput> {
		return this.usersService.verifyEmail(code);
	}
}