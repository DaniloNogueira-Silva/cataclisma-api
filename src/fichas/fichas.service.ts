import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ficha, FichaDocument } from './schemas/ficha.schema';

@Injectable()
export class FichasService {
  constructor(
    @InjectModel(Ficha.name) private readonly fichaModel: Model<FichaDocument>,
  ) {}

  // ── LIST (resumo) ────────────────────────────────────────────────────────
  async findAll(userId: string) {
    return this.fichaModel
      .find({ userId: new Types.ObjectId(userId) })
      .select('nome nivel classe origem updatedAt')
      .lean({ virtuals: false })
      .exec()
      .then((docs) =>
        docs.map((d) => ({
          id: d._id,
          nome: d.nome,
          nivel: d.nivel,
          classe: d.classe,
          origem: d.origem,
          updatedAt: (d as any).updatedAt,
        })),
      );
  }

  // ── GET ONE ──────────────────────────────────────────────────────────────
  async findOne(id: string, userId: string) {
    const ficha = await this.fichaModel.findById(id).exec();
    this.assertOwner(ficha, userId);
    return ficha!.toJSON();
  }

  // ── CREATE ───────────────────────────────────────────────────────────────
  async create(data: Partial<Ficha>, userId: string) {
    const created = await this.fichaModel.create({
      ...data,
      userId: new Types.ObjectId(userId),
    });
    return created.toJSON();
  }

  // ── UPDATE (PATCH) ───────────────────────────────────────────────────────
  async update(id: string, data: Partial<Ficha>, userId: string) {
    const ficha = await this.fichaModel.findById(id).exec();
    this.assertOwner(ficha, userId);

    Object.assign(ficha!, data);
    ficha!.userId = new Types.ObjectId(userId); // garante que não muda o dono
    await ficha!.save();
    return ficha!.toJSON();
  }

  // ── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string, userId: string) {
    const ficha = await this.fichaModel.findById(id).exec();
    this.assertOwner(ficha, userId);
    await ficha!.deleteOne();
    return { ok: true };
  }

  // ── helpers ──────────────────────────────────────────────────────────────
  private assertOwner(ficha: FichaDocument | null, userId: string) {
    if (!ficha) throw new NotFoundException('Ficha not found');
    if (ficha.userId.toString() !== userId) throw new ForbiddenException();
  }
}
