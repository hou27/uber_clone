import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User, UserRole } from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { SetMetadata } from '@nestjs/common';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Mutation((returns) => CreateRestaurantOutput)
	@SetMetadata('role', UserRole.Owner) // set metadata
	async createRestaurant(
		@AuthUser() authUser: User,
		@Args('input') createRestaurantInput: CreateRestaurantInput
	): Promise<CreateRestaurantOutput> {
		return this.restaurantService.createRestaurant(authUser, createRestaurantInput);
	}
}