import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  message: string;

  // Expect 'YYYY-MM-DD' (date-only). IsDateString allows full ISO; we'll additionally validate format inside service.
  @IsDateString()
  date: string;
}
