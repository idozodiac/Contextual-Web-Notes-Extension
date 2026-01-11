import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsNotEmpty()
  x: number;

  @IsNumber()
  @IsNotEmpty()
  y: number;
}
