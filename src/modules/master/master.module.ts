import { Module } from '@nestjs/common';
import { MenuModule } from './menus/menu.module';

@Module({
  imports: [MenuModule],
})
export class MasterModule {}
