import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Injectable()
export class RestaurantService {
	constructor(
		@InjectRepository(Restaurant)
		private readonly restaurants: Repository<Restaurant>
	) {}
	getAll(): Promise<Restaurant[]> {
		// add promise because find is async method
		return this.restaurants.find();
	}
	createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
		const newRestaurant = this.restaurants.create(createRestaurantDto); // create new instance
		return this.restaurants.save(newRestaurant); // save entitiy on the DB
	}
	updateRestaurant({ id, data }: UpdateRestaurantDto) {
		return this.restaurants.update(id, { ...data });
	}
}