import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
// import configuration from './configuration';
import * as Joi from 'joi';
import { LogsModule } from './logs/logs.module';
import { connectionParams } from 'ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusModule } from './menus/menus.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
// import { ProfilesModule } from './profiles/profiles.module';
import { ArticlesModule } from './articles/articles.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { DataSource } from 'typeorm';
import { OptionsModule } from './siteOptions/siteOptions.module';
import createDefaultOption from './seeds/options.seed';
import createDefaultRoles from './seeds/roles.seed';
import createDefaultUser from './seeds/user.seed';
import createDefaultProfile from './seeds/profile.seed';

const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      // load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    AuthModule,
    RolesModule,
    // ProfilesModule,
    ArticlesModule,
    CategoriesModule,
    TagsModule,
    MenusModule,
    OptionsModule,
  ],
  controllers: [],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {
    this.seeds();
  }

  async seeds() {
    await createDefaultOption(this.dataSource);
    await createDefaultRoles(this.dataSource);
    await createDefaultProfile(this.dataSource);
    await createDefaultUser(this.dataSource);
  }
}
