import { ArgsType, Field } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field(type => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field(type => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @Field(type => String)
  @IsString()
  address: string;

  @Field(type => String)
  @IsString()
  ownersName: string;
}
/* on graphqlplayground works well
mutation {
  createRestaurant(
    name: "1241254wre1221214",
	isVegan: false,
    address: "12509294",
    ownersName: "HOu",
  )
}
*/