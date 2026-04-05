import { Controller, Get, Post, Body } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('master/menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenuTree() {
    return this.menuService.getMenuTree();
  }

  @Post()
  async getMenuTreePost(@Body() payload: any) {
    // Sigma accepts a role id parameter here conceptually
    return this.menuService.getMenuTree();
  }
}
