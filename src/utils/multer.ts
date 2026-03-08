import { diskStorage } from "multer";
import { extname } from "path";
import { BadRequestException } from "@nestjs/common";

export const multerOptions = {
  storage: diskStorage({
    destination: "./uploads/avatars",
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(new BadRequestException("Faqat rasm yuklash mumkin!"), false);
    }
    callback(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
};
