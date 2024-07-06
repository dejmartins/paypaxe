import mongoose from "mongoose";
import config from "../../config/default";

export default async function connect(){
    const dbUri: string = config.db.dbURI;

    try {
        await mongoose.connect(dbUri);
        console.log('Connected to DB')
    } catch(error: any) {
        console.error('Could not connect to DB')
        process.exit(1)
    }
}