import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = process.env.MONGODB_URI ?? '';
console.log('[debug] MONGODB_URI check:', {
  present: uri.length > 0,
  length: uri.length,
  tail: uri.slice(-8),
  hasNewline: /[\r\n]/.test(uri),
  hasLeadingOrTrailingSpace: uri !== uri.trim(),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  }); // libera todas as origens — ajuste em produção

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
