import {ConnectionOptions, createConnection, useContainer} from 'typeorm';
import {ApolloServer, ServerInfo} from 'apollo-server';
import {buildSchema} from 'type-graphql';
import {Container} from 'typedi';
import {GraphQLSchema} from 'graphql';
import {DatabaseConfig} from './config/database.config';

export class Application {

  public server: ApolloServer;
  public serverInfo: ServerInfo;

  public async bootstrap(): Promise<void> {
    const databaseConfig: ConnectionOptions = DatabaseConfig.getDatabaseConnectionConfiguration();

    useContainer(Container);
    await createConnection(databaseConfig);

    const schema: GraphQLSchema = await buildSchema({
      resolvers: [
        process.env.IS_DEV
          ? `${__dirname}/resolvers/**/*.ts`
          : `${__dirname}/resolvers/**/*.js`,
      ],
      container: Container,
    });

    this.server = new ApolloServer({ schema });
    this.serverInfo = await this.server.listen(4000);

    console.log(`Server has started: ${this.serverInfo.url}`);
  }

  public async close(): Promise<void> {
    await this.server.stop();

    console.log('Server closed');
  }
}
