import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
	constructor(
		@InjectRepository(Restaurant)
		private readonly restaurants: Repository<Restaurant>,
	) {}
	getAll(): Promise<Restaurant[]> {	// add promise because find is async method
		return this.restaurants.find();
	}
}