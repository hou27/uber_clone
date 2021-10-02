import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Query((returns) => [Restaurant])
	restaurants(): Promise<Restaurant[]> {
		return this.restaurantService.getAll();
	}

	@Mutation((returns) => Boolean)
	async createRestaurant(
		@Args('input') createRestaurantDto: CreateRestaurantDto
	): Promise<boolean> {
		try {
			await this.restaurantService.createRestaurant(createRestaurantDto);
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	@Mutation((returns) => Boolean) // ArgsType을 쓴다면 비워두어야 하고 InputType을 쓴다면 인자에 이름이 있어야한다.
	async updateRestaurant(@Args('input') updateRestaurantDto: UpdateRestaurantDto) {
		return true;
	}
}