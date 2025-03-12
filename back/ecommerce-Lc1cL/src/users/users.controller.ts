import {
  Controller,
  Delete,
  Get,
  Put,
  Body,
  HttpCode,
  Param,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth2Guard } from 'src/guards/auth2.guard';
import { UpdateUserDto } from './users.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiPartialContentResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiBearerAuth()
  @HttpCode(200)
  @Get()
  @ApiOperation({ summary: 'Get all users [ADMIN ONLY]' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of users per page',
    schema: { default: 5 },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page displayed from list of users ',
    schema: { default: 1 },
  })
  @Roles(Role.Admin)
  @UseGuards(Auth2Guard, RolesGuard)
  getUsers(@Query('page') page: string, @Query('limit') limit: string) {
    !page ? (page = '1') : page;
    !limit ? (limit = '5') : limit;
    return this.usersService.getUsers(Number(page), Number(limit));
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: String, description: 'User id' })
  @UseGuards(Auth2Guard)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: String, description: 'User id' })
  @UseGuards(Auth2Guard)
  UpdateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, user);
  }

  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', type: String, description: 'User id' })
  @UseGuards(Auth2Guard)
  DeleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUserById(id);
  }
}
