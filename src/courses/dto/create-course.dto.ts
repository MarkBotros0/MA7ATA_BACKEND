import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, description: 'Required on only if Admin' })
  instructorId: number;
}
