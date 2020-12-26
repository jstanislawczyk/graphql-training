import {ConnectionOptions} from 'typeorm';
import config from 'config';

export class DatabaseConfig {

  public static getDatabaseConnectionConfiguration(): ConnectionOptions {
    const isDev: boolean = config.get('common.isDev');

    return <ConnectionOptions> {
      type: 'sqlite',
      database: './db.sqlite3',
      synchronize: true,
      logging: false,
      entities: [
        isDev
          ? 'src/models/**/*.ts'
          : 'build/src/models/**/*.js',
      ],
      migrations: [
        isDev
          ? 'src/migration/**/*.ts'
          : 'build/src/migration/**/*.js',
      ],
      subscribers: [
        isDev
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
