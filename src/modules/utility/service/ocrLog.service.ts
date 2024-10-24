import Tesseract from "tesseract.js";
// import OCRLogModel from "../model/ocrLog.model";

export async function processOCRImage(imageUrl: string): Promise<{ amount: string, description: string }> {
    try {
        const { data: { text } } = await Tesseract.recognize(imageUrl, 'eng', {
            logger: (info) => console.log(info)
        });

        const amount = extractAmount(text);
        const description = extractDescription(text);

        // await OCRLogModel.create({ imageUrl: imageUrl, ocrResult: text });

        return { amount, description };
    } catch (error: any) {
        throw new Error(`Error processing OCR: ${error.message}`);
    }
}

function extractAmount(ocrText: string): string {
    const regex = /Total\s*[N\$]\s*(\d+.\d+)/i;
    const match = ocrText.match(regex);
    return match ? match[1] : '';
}

function extractDescription(ocrText: string): string {
    return ocrText;
}
