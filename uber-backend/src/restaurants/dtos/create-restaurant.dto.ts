import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
	Restaurant,
	['id'],
	InputType /* add an arg to fix err */
) {} // omit id in restaurant

/**
 * If the parent and child types are different,
 * (e.g., the parent is decorated with @ObjectType),
 * we would pass InputType as the second argument.
 */