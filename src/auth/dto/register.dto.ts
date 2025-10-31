import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  // Email becomes the unique username. class-validator ensures we reject
  // malformed addresses before hitting the database.
  @IsEmail()
  email: string;

  // Front-end and backend share the 6 char minimum via validation decorators.
  @IsString()
  @MinLength(6)
  password: string;
}
