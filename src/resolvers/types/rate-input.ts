import { Field, ID, InputType, Int } from "type-graphql";

@InputType()
export class RateInput {
  @Field(() => ID)
  public recipeId!: string;

  @Field(() => Int)
  public value: number = 0;
}
