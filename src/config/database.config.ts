import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {registerAs} from '@nestjs/config'

export default registerAs("database", (): TypeOrmModuleOptions =>({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false
}))