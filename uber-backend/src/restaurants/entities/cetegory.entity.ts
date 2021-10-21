import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType({ isAbstract: true })
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

	@Field((type) => [Restaurant])
	// https://typeorm.io/#/many-to-one-one-to-many-relations
	@OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
	restaurants: Restaurant[];
}