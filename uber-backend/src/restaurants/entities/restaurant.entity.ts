import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './cetegory.entity';
import { User } from 'src/users/entities/user.entity';

// Fix err : Schema must contain uniquely named types but contains multiple types named "Restaurant".
@InputType('RestaurantInputType', { isAbstract: true }) // isAbstract : do not add to Schema
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
	@Field((type) => String)
	@Column()
	@IsString()
	@Length(5)
	name: string;

	@Field((type) => String)
	@Column()
	@IsString()
	coverImg: string;

	@Field((type) => String, { defaultValue: '수지' })
	@Column()
	@IsString()
	address: string;

	@Field((type) => Category, { nullable: true })
	// https://typeorm.io/#/many-to-one-one-to-many-relations
	@ManyToOne((type) => Category, (category) => category.restaurants, {
		// restaurant doesn't have to have category.
		// If we delete a category, we don't want to delete a restaurant.
		nullable: true,
		onDelete: 'SET NULL',
	})
	category: Category;

	@Field((type) => User)
	@ManyToOne((type) => User, (user) => user.restaurants)
	owner: User;
}