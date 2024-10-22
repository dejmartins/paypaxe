import { object, string, TypeOf } from "zod";

export const uploadReceiptSchema = object({
    body: object({
        imageUrl: string({
            required_error: 'Image URL is required'
        }).url("Not a valid URL")
    })
});

export type UploadReceiptInput = TypeOf<typeof uploadReceiptSchema>;
