import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) { }

  async onModuleInit() {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: Number(this.configService.get<number>('DB_PORT', 5433)),
      user: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASS') || this.configService.get<string>('DB_PASSWORD', 'postgres'),
      database: this.configService.get<string>('DB_NAME', 'db_school'),
    });

    const searchPath = this.configService.get<string>('DB_SCHEMA', 's_core, s_master, public');

    // Configure the pool to use the specified schemas in search_path for all connections
    this.pool.on('connect', (client) => {
      client.query(`SET search_path TO ${searchPath}`).catch(err => {
        this.logger.error('Failed to set search_path on connect', err);
      });
    });

    try {
      await this.pool.query('SELECT 1');
      this.logger.log('Successfully connected to Postgres database');
    } catch (e) {
      this.logger.error('Failed to initialize database connection', e);
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  /**
   * Generic query method that executes SQL and returns the rows array.
   */
  async query<R extends QueryResultRow = any>(queryText: string, params: any[] = []): Promise<R[]> {
    const result = await this.pool.query<R>(queryText, params);
    return result.rows;
  }
}
