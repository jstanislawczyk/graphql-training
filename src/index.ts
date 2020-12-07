import 'reflect-metadata';
import {ConnectionOptions, createConnection, useContainer} from 'typeorm';
import {ApolloServer, ServerInfo} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {Container} from 'typedi';
import {DatabaseConfig} from './config/database.config';
import {GraphQLSchema} from 'graphql';

async function bootstrap() {

  const databaseConfig: ConnectionOptions = DatabaseConfig.getDatabaseConnectionConfiguration();

  useContainer(Container);

  await createConnection(databaseConfig);

  const schema: GraphQLSchema = await buildSchema({
    resolvers: [
      `${__dirname}/resolvers/**/*.{ts,js}`,
    ],
    container: Container,
  });

  const server: ApolloServer = new ApolloServer({ schema });
  const serverInfo: ServerInfo = await server.listen(4000);

  console.log(`Server has started: ${serverInfo.url}`);
}

bootstrap().then();
