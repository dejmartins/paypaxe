import mongoose from "mongoose";
import { string } from "zod";

export const objectIdValidator = string({
    required_error: 'User ID is required'
}).refine(value => mongoose.Types.ObjectId.isValid(value), {
    message: 'Invalid ID format'
});