import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserCreateProvider {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async create(createUserDto: CreateUserDto) {
    let existingUser = null;

    try {
      existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later.',
        {
          description: `Error connecting to the database ${error}`,
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    try {
      const hashedPassword = await this.hashingProvider.hashPassword(
        createUserDto.password,
      );

      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const user = await this.userModel
        .findById(newUser._id)
        .lean()
        .select('-password');

      return user;
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try again later.',
        {
          description: `Error connecting to the database ${error}`,
        },
      );
    }
  }
}
