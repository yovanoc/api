import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Lazy } from "../helpers";
import { Rate } from "./rate";
import { User } from "./user";

@Entity()
@ObjectType()
export class Recipe {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @Field()
  @Column()
  public title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public description?: string;

  @Field(type => [Rate])
  @OneToMany(type => Rate, rate => rate.recipe, { lazy: true, cascade: ["insert"] })
  public ratings!: Lazy<Rate[]>;

  @Field(type => User)
  @ManyToOne(type => User, { lazy: true })
  public author!: Lazy<User>;
}
