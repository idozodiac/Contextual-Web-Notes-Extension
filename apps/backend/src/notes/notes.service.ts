import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAll(url?: string) {
    if (url) {
      return this.prisma.note.findMany({
        where: { url },
        orderBy: { createdAt: 'desc' },
      });
    }
    return this.prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        url: createNoteDto.url,
        content: createNoteDto.content || '',
        x: createNoteDto.x,
        y: createNoteDto.y,
      },
    });
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    const note = await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: {
        content:
          updateNoteDto.content !== undefined
            ? updateNoteDto.content
            : note.content,
        x: updateNoteDto.x !== undefined ? updateNoteDto.x : note.x,
        y: updateNoteDto.y !== undefined ? updateNoteDto.y : note.y,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.note.delete({
      where: { id },
    });
  }
}
