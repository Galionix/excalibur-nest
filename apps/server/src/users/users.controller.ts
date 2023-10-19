import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.usersService.remove(+id);
  // }

  @Post("login")
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.login(createUserDto);
  }
  // remove
  @Post("remove")
  remove(@Body() removeUserDto: { uid: string }) {
    // console.log("removeUserDto: ", removeUserDto);
    return this.usersService.remove(removeUserDto.uid);
  }
  // set user location
  @Post("setLocation")
  setLocation(
    @Body()
    setLocationDto: {
      uid: string;
      location: string;
      entry: string;
      x: number;
      y: number;
    },
  ) {
    // console.log("setLocationDto: ", setLocationDto);
    return this.usersService.setLocation(setLocationDto);
  }
}
