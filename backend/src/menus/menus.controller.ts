import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menus')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Get()
  async findByRestaurant(@Query('restaurant_id') restaurantId: string) {
    return this.menusService.findByRestaurantId(+restaurantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.menusService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { restaurant_id: number } & any) {
    return this.menusService.create(body.restaurant_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.menusService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.menusService.delete(+id);
  }
}
