import { ConnectionOptions } from "typeorm";
import { join } from "path";
import dotenv from "dotenv";

import { Survey } from "./entities/Survey";
import { Participant } from "./entities/Participant";
import { Question } from "./entities/Question";
import { Answer } from "./entities/Answer";
import { FinishedQuestion } from "./entities/FinishedQuestion";
import { Trustee } from "./entities/Trustee";
import { Report } from "./entities/Report";

// load the environment variables from the .env file
dotenv.config({
  path: ".env",
});

// to use migrations: s. https://github.com/typeorm/typeorm/blob/master/docs/using-cli.md#installing-cli
// and https://github.com/nestjs/nest/issues/4990
const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST!,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  entities: [
    Survey,
    Participant,
    Question,
    Answer,
    FinishedQuestion,
    Trustee,
    Report,
  ],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: false,
  migrations: [join(__dirname, "migrations/*{.ts,.js}")],
  cli: {
    migrationsDir: "src/migrations",
  },
};

export = connectionOptions;

// migration:
// https://github.com/typeorm/typeorm/issues/2828
