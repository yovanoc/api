import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Lazy } from "../helpers";
import { Recipe } from "./recipe";

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column()
  public email!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public nickname?: string;

  @Column()
  public password!: string;

  @OneToMany(type => Recipe, recipe => recipe.author, { lazy: true })
  @Field(type => [Recipe])
  public recipes!: Lazy<Recipe[]>;
}
