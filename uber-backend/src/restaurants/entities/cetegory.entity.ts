import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

// Fix err : Schema must contain uniquely named types but contains multiple types named "Category".
// This err because of we use same name on InputType and ObjectType.
@InputType('CategoryInputType', { isAbstract: true }) // Q : why InputType doesn't extends CoreEntity..?
@ObjectType()
@Entity()
export class Category extends CoreEntity {
	@Field((type) => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field((type) => String)
	@Column()
	@IsString()
	coverImg: string;

	@Field((type) => [Restaurant], { nullable: true })
	@OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
	restaurants: Restaurant[];
}