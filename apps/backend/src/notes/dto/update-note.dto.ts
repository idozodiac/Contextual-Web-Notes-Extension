import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  x?: number;

  @IsNumber()
  @IsOptional()
  y?: number;
}
