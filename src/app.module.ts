import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/students/students.module';
import { DatabaseModule } from './database/database.module';
import { MasterModule } from './modules/master/master.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { CommonModule } from './modules/common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/admin/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// import { UtilitiesModule } from './modules/utilities/utilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS') || configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'db_school'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    DatabaseModule,
    StudentsModule,
    MasterModule,
    SettingsModule,
    AcademicsModule,
    CommonModule,
    // UtilitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
