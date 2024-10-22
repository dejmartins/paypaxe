import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import { processOCRImage } from "../service/ocrLog.service";
import { successResponse } from "../../../shared/utils/response";
import path from "path";

export const uploadOCRImageHandler = asyncHandler(async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    const { amount, description } = await processOCRImage(imageUrl);

    return res.json(successResponse({ amount, description }, "Image processed and data extracted successfully"));
});
