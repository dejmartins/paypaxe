import { Schema, model, Document } from "mongoose";

interface IOCRLog extends Document {
    imageUrl: string;
    ocrResult: string;
    createdAt: Date;
}

const ocrLogSchema = new Schema<IOCRLog>({
    imageUrl: { 
        type: String, 
        required: true 
    },
    ocrResult: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now }
});

const OCRLogModel = model<IOCRLog>('OCRLog', ocrLogSchema);
export default OCRLogModel;
