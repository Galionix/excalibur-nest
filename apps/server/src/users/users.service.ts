import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/User.entity';

// import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(uid: string) {
    return this.userRepository.findOne({
      where: {
        uid,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(uid: string) {
    const user = this.userRepository.findOne({
      where: {
        uid,
      },
    });
    if (!user) {
      return "no user found";
    }
    console.log("removed uid: ", uid);
    return this.userRepository.delete({
      uid,
    });
  }

  async login(createUserDto: CreateUserDto) {
    console.log("createUserDto: ", createUserDto);
    const existingUser = await this.findOne(createUserDto.uid);
    if (existingUser) {
      return existingUser;
    }

    const newUser = this.userRepository.create(createUserDto);
    newUser.inventory = [];
    newUser.player = {
      experience: 0,
      name: createUserDto.name,
      character: "",
      level: 1,
      hp: 100000,
      mana: 100000,
    };

    // };
    // newUser.player.name = createUserDto.name;

    await this.userRepository.save(newUser);
    return newUser;
  }

  async setLocation(setLocationDto: {
    uid: string;
    location: string;
    entry: string;
    x: number;
    y: number;
  }) {
    const user = await this.findOne(setLocationDto.uid);
    if (!user) {
      return "no user found";
    }
    user.location = {
      map: setLocationDto.location,
      entry: setLocationDto.entry,
      x: setLocationDto.x,
      y: setLocationDto.y,
    };
    await this.userRepository.save(user);
    return user;
  }
}
