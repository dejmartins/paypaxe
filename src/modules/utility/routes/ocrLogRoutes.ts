import { Router } from "express";
import { uploadOCRImageHandler } from "../controller/ocrLog.controller";
import validate from "../../../shared/middlewares/validateResource";
import { uploadReceiptSchema } from "../schema/ocrLog.schema";

const router = Router();

router.post('/ocr/upload', validate(uploadReceiptSchema), uploadOCRImageHandler);

export default router;