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
// import { UtilitiesModule } from './modules/utilities/utilities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // DatabaseService, // Wait, DatabaseModule should be used, but previous edits used DatabaseService in imports? 
    // Checking app.module.ts content again... actually it was DatabaseModule.
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
