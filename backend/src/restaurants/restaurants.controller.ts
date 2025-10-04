import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async findAll() {
    return this.restaurantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.restaurantsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: any) {
    return this.restaurantsService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.restaurantsService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.restaurantsService.delete(+id);
  }
}
