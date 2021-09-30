import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
	@Query((returns) => [Restaurant])
	restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
		return [];
	}

	@Mutation((returns) => Boolean)
	createRestaurant(
		/* also you can do like this either.
		@Args('name') name: string,
		@Args('isVegan') isVegan: boolean,
		@Args('address') address: string,
		@Args('ownersName') ownersName: string,
		
		or 
		
		@Args('createRestaurantInput') createRestaurantInput: CreateRestaurantDto
		*/
		@Args() createRestaurantDto: CreateRestaurantDto): boolean {
		console.log(createRestaurantDto);
		return true;
	}
}