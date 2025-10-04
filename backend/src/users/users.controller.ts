import { Controller, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('address')
  async updateAddress(@Request() req, @Body() updateAddressDto: UpdateAddressDto) {
    const user = await this.usersService.updateAddress(
      req.user.userId,
      updateAddressDto.address,
      updateAddressDto.latitude,
      updateAddressDto.longitude,
    );

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
      },
    };
  }
}
