import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantResolver } from './restaurants.resolver';
import { RestaurantService } from './restaurants.service';
import { Category } from './entities/cetegory.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Restaurant, Category])],	// import repository
	providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}