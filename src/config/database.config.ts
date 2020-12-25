import {ConnectionOptions} from 'typeorm';

export class DatabaseConfig {

  public static getDatabaseConnectionConfiguration(): ConnectionOptions {

    return <ConnectionOptions> {
      type: 'sqlite',
      database: './db.sqlite3',
      synchronize: true,
      logging: false,
      entities: [
        process.env.IS_DEV
          ? 'src/models/**/*.ts'
          : 'build/src/models/**/*.js',
      ],
      migrations: [
        process.env.IS_DEV
          ? 'src/migration/**/*.ts'
          : 'build/src/migration/**/*.js',
      ],
      subscribers: [
        process.env.IS_DEV
          ? 'src/subscriber/**/*.ts'
          : 'build/src/subscriber/**/*.js',
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
