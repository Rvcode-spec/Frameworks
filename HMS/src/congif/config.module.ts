import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default (): TypeOrmModuleOptions => {
  const useSSL = process.env.DB_SSL === 'true';

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: true,
    ...(useSSL && {
      ssl: { rejectUnauthorized: false },
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
  };
};
