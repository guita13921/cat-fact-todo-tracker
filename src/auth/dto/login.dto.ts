import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  // Mirror the RegisterDto requirements so the login endpoint behaves
  // consistently with the account creation flow.
  @IsEmail()
  email: string;

  // Password length is validated to avoid hitting bcrypt with clearly invalid
  // input.
  @IsString()
  @MinLength(6)
  password: string;
}
