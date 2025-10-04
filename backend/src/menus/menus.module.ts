import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { Menu } from './menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  providers: [MenusService],
  controllers: [MenusController],
})
export class MenusModule {}
