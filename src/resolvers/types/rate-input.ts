import { Field, ID, InputType, Int } from "type-graphql";

@InputType()
export class RateInput {
  @Field(type => ID)
  public recipeId: string = "";

  @Field(type => Int)
  public value: number = 0;
}
