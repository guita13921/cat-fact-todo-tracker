import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTodoDto {
  // Message is displayed verbatim in the front-end, so we trim length here to
  // keep the UI manageable.
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  message: string;

  // Expect 'YYYY-MM-DD' (date-only). IsDateString allows full ISO; we'll additionally validate format inside service.
  @IsDateString()
  date: string;
}
