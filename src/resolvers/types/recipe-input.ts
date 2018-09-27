import { Field, InputType } from "type-graphql";

import { Recipe } from "../../entities/recipe";

@InputType()
export class RecipeInput implements Partial<Recipe> {
  @Field()
  public title!: string;

  @Field({ nullable: true })
  public description?: string;
}
