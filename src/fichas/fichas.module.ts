import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ficha, FichaSchema } from './schemas/ficha.schema';
import { FichasController } from './fichas.controller';
import { FichasService } from './fichas.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ficha.name, schema: FichaSchema }]),
  ],
  controllers: [FichasController],
  providers: [FichasService],
})
export class FichasModule {}
