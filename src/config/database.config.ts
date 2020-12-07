import {ConnectionOptions} from 'typeorm';

export class DatabaseConfig {

  public static getDatabaseConnectionConfiguration(): ConnectionOptions {

    return <ConnectionOptions> {
      type: 'sqlite',
      database: './db.sqlite3',
      synchronize: true,
      logging: false,
      entities: [
        'src/models/**/*.ts',
      ],
      migrations: [
        'src/migration/**/*.ts',
      ],
      subscribers: [
        'src/subscriber/**/*.ts',
      ],
      cli: {
        entitiesDir: 'src/models',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
      useUnifiedTopology: true,
    };
  }
}
