import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { User } from 'src/users/entities/user.entity';
import { Dish } from './dish.entity';
import { Order } from 'src/orders/entities/order.entity';

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

  @Field((type) => String)
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
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE', // if the user is deleted, then also going to delete restaurant.
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner) // Loads id (or ids) of specific relations into properties. For example, if you have a many-to-one category in your Post entity, you can have a new category id by marking a new property with @RelationId.
  ownerId: number;

  @Field((type) => [Dish], { nullable: true })
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu?: Dish[];

  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.restaurant)
  orders: Order[];
}
