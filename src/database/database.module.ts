import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../config/database.config';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(databaseConfig)],
      inject: [databaseConfig.KEY],
      useFactory: (
        databaseConfigurations: ConfigType<typeof databaseConfig>,
      ) => {
        return {
          type: databaseConfigurations.type,
          host: databaseConfigurations.host,
          port: databaseConfigurations.port,
          username: databaseConfigurations.username,
          password: databaseConfigurations.password,
          database: databaseConfigurations.database,
          autoLoadEntities: databaseConfigurations.autoLoadEntities,
          synchronize: databaseConfigurations.synchronize,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
