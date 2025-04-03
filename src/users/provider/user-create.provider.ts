import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { CreateUserDto } from '../dto/create-user.dto';
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
      // Check is user exists with same email
      existingUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
    } catch (error) {
      // Might save the details of the exception
      // Information which is sensitive
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    // Handle exception
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email.',
      );
    }

    // Create a new user
    let newUser: User;
    try {
      newUser = await this.userModel.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the the datbase',
        },
      );
    }

    return newUser;
  }
}
