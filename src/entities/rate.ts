import { Field, Int, ObjectType } from "type-graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { Lazy } from "../helpers";
import { Recipe } from "./recipe";
import { User } from "./user";

@Entity()
@ObjectType()
export class Rate {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field(() => Int)
  @Column({ type: "int" })
  public value!: number;

  @Field(() => User)
  @ManyToOne(() => User, { lazy: true })
  public user!: Lazy<User>;

  @Field()
  @CreateDateColumn()
  public date!: Date;

  @ManyToOne(() => Recipe, { lazy: true })
  public recipe!: Lazy<Recipe>;
}
