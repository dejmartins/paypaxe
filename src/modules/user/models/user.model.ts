import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import config from "../../../../config/default";

const userSchema = new mongoose.Schema({}, { timestamps: true})