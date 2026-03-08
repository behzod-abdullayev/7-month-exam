import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("hh.uz")
  .setDescription("hh.uz klonini yasash")
  .setVersion("1.0")
  .addBearerAuth(
    {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      description: "jwt token kiriting",
      in: "header",
    },
    "JWT-auth",
  )
  .build();
