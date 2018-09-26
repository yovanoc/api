import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

import { Rate } from "../entities/rate";
import { Recipe } from "../entities/recipe";
import { IContext } from "./types/context";
import { RateInput } from "./types/rate-input";
import { RecipeInput } from "./types/recipe-input";

@Resolver(Recipe)
export class RecipeResolver {
  constructor(
    @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Rate) private readonly ratingsRepository: Repository<Rate>,
  ) { }

  @Query(returns => Recipe, { nullable: true })
  public recipe(@Arg("recipeId", type => Int) recipeId: number) {
    return this.recipeRepository.findOne(recipeId);
  }

  @Query(returns => [Recipe])
  public recipes(): Promise<Recipe[]> {
    return this.recipeRepository.find();
  }

  @Mutation(returns => Recipe)
  public addRecipe(@Arg("recipe") recipeInput: RecipeInput, @Ctx() { user }: IContext): Promise<Recipe> {
    const recipe = this.recipeRepository.create({
      ...recipeInput,
      author: user,
    });
    return this.recipeRepository.save(recipe);
  }

  @Mutation(returns => Recipe)
  public async rate(@Ctx() { user }: IContext, @Arg("rate") rateInput: RateInput): Promise<Recipe> {
    // find the recipe
    const recipe = await this.recipeRepository.findOne(rateInput.recipeId, {
      relations: ["ratings"], // preload the relation as we will modify it
    });
    if (!recipe) {
      throw new Error("Invalid recipe ID");
    }

    // add the new recipe rate
    (await recipe.ratings).push(
      this.ratingsRepository.create({
        recipe,
        user,
        value: rateInput.value,
      }),
    );

    // return updated recipe
    return this.recipeRepository.save(recipe);
  }
}
