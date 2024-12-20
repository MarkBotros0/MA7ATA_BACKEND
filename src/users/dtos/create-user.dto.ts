import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../enums/gender.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: false })
  email: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fullname?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsEnum(Gender, {
    message: `type must be a valid enum value like: ${Object.values(
      Gender
    ).join(', ')}`
  })
  gender?: Gender;
}
