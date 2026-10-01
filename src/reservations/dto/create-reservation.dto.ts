import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'Carlos Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'customerName is required' })
  customerName: string;

  @ApiProperty({ example: 'carlos@email.com' })
  @IsEmail({}, { message: 'email must be a valid email' })
  email: string;

  @ApiProperty({ example: 4, minimum: 1 })
  @IsInt()
  @Min(1, { message: 'people must be at least 1' })
  people: number;
}