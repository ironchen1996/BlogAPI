import { Module } from '@nestjs/common';
import { OptionsService } from './siteOptions.service';
import { OptionsController } from './siteOptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { siteOption } from './entities/siteOption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([siteOption])],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
