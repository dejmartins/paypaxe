import mongoose from "mongoose";
import config from "../../../config/default";
import log from "./logger";

export default async function connect(){
    const dbUri: string = config.db.dbURI;

    try {
        await mongoose.connect(dbUri);
        log.info('Connected to DB')
    } catch(error: any) {
        log.error('Could not connect to DB')
        process.exit(1)
    }
}