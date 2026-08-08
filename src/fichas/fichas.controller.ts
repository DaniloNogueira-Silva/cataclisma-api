import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FichasService } from './fichas.service';

@UseGuards(JwtAuthGuard)
@Controller('fichas')
export class FichasController {
  constructor(private readonly fichasService: FichasService) {}

  @Get()
  findAll(@Request() req: any, @Query('all') all: string) {
    const showAll = all === 'true' && req.user.isAdmin;
    return this.fichasService.findAll(req.user.sub, showAll);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.fichasService.findOne(id, req.user.sub);
  }

  @Post()
  create(@Body() body: any, @Request() req: any) {
    return this.fichasService.create(body, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.fichasService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.fichasService.remove(id, req.user.sub);
  }
}
