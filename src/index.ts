import { GraphQLServer, Options } from "graphql-yoga";
import "reflect-metadata";
import * as TypeGraphQL from "type-graphql";
import { Container } from "typedi";
import * as TypeORM from "typeorm";

import { Rate } from "./entities/rate";
import { Recipe } from "./entities/recipe";
import { User } from "./entities/user";
import { seedDatabase } from "./helpers";
import { RecipeResolver } from "./resolvers/recipe-resolver";
import { IContext } from "./resolvers/types/context";

// register 3rd party IOC container
TypeGraphQL.useContainer(Container);
TypeORM.useContainer(Container);

async function bootstrap() {
  try {
    // create TypeORM connection
    await TypeORM.createConnection({
      type: "postgres",
      database: "type-graphql",
      username: "postgres",
      password: "azerty",
      port: 5432,
      host: "localhost",
      entities: [Recipe, Rate, User],
      synchronize: true,
      logger: "advanced-console",
      logging: "all",
      dropSchema: true,
      cache: true,
    });

    // seed database with some data
    const { defaultUser } = await seedDatabase();

    // build TypeGraphQL executable schema
    const schema = await TypeGraphQL.buildSchema({
      resolvers: [RecipeResolver],
    });

    // create mocked context
    const context: IContext = { user: defaultUser };

    // Create GraphQL server
    const server = new GraphQLServer({ schema, context });

    // Configure server options
    const serverOptions: Options = {
      port: 4000,
      endpoint: "/graphql",
      playground: "/playground",
    };

    // Start the server
    server.start(serverOptions, ({ port, playground }) => {
      // tslint:disable-next-line:no-console
      console.log(
        `Server is running, GraphQL Playground available at http://localhost:${port}${playground}`,
      );
    });
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.error(err);
  }
}

bootstrap();
