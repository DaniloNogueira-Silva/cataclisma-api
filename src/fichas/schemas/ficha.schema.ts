import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FichaDocument = HydratedDocument<Ficha>;

// ─── Sub-schemas ────────────────────────────────────────────────────────────

@Schema({ _id: false })
class Atributos {
  @Prop({ default: 1 }) fisico: number;
  @Prop({ default: 1 }) agilidade: number;
  @Prop({ default: 1 }) intelecto: number;
  @Prop({ default: 1 }) social: number;
  @Prop({ default: 1 }) vontade: number;
}

@Schema({ _id: false })
class Arma {
  @Prop({ required: true }) id: string;
  @Prop({ default: '' }) nome: string;
  @Prop({ default: '' }) dano: string;
  @Prop({ default: '' }) tipo: string;
  @Prop({ default: '' }) alcance: string;
  @Prop({ default: '' }) especial: string;
}

@Schema({ _id: false })
class ItemInventario {
  @Prop({ required: true }) id: string;
  @Prop({ default: '' }) descricao: string;
  @Prop({ default: '' }) espaco: string;
}

@Schema({ _id: false })
class Implante {
  @Prop({ required: true }) id: string;
  @Prop({ default: '' }) descricao: string;
  @Prop({ default: 0 }) cn: number;
}

@Schema({ _id: false })
class Habilidade {
  @Prop({ required: true }) id: string;
  @Prop({ default: '' }) nome: string;
  @Prop({ default: '' }) descricao: string;
  @Prop({ default: false }) origem: boolean;
}

@Schema({ _id: false })
class TecnicaNox {
  @Prop({ required: true }) id: string;
  @Prop({ default: 1 }) nivel: number;
  @Prop({ default: '' }) nome: string;
  @Prop({ default: '' }) descricao: string;
}

// ─── Main schema ─────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Ficha {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  // identidade
  @Prop({ default: '' }) nome: string;
  @Prop({ default: 1 }) nivel: number;
  @Prop({ default: 0 }) xp: number;
  @Prop({ default: '' }) classe: string;
  @Prop({ default: '' }) origem: string;

  // recursos
  @Prop({ default: 20 }) vida: number;
  @Prop({ default: 20 }) vidaMax: number;
  @Prop({ default: 5 }) energia: number;
  @Prop({ default: 5 }) energiaMax: number;
  @Prop({ default: 0 }) nox: number;
  @Prop({ default: 0 }) noxMax: number;
  @Prop({ default: 0 }) iniciativa: number;
  @Prop({ default: 10 }) defesa: number;
  @Prop({ default: 0 }) rd: number;

  @Prop({ type: Atributos, default: () => ({}) })
  atributos: Atributos;

  // pericias: Record<string, 0|5|10|15> → armazenado como mapa
  @Prop({ type: Map, of: Number, default: {} })
  pericias: Map<string, number>;

  @Prop({ type: [Arma], default: [] }) armas: Arma[];
  @Prop({ type: [ItemInventario], default: [] }) inventario: ItemInventario[];
  @Prop({ type: [Implante], default: [] }) implantes: Implante[];
  @Prop({ type: [Habilidade], default: [] }) habilidades: Habilidade[];
  @Prop({ type: [TecnicaNox], default: [] }) tecnicasNox: TecnicaNox[];

  @Prop({ default: '' }) notas: string;
}

export const FichaSchema = SchemaFactory.createForClass(Ficha);

FichaSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // convert Map → plain object
    if (ret.pericias instanceof Map) {
      ret.pericias = Object.fromEntries(ret.pericias);
    }
    return ret;
  },
});
