import { Schema, model } from "mongoose";

const verifySchema = new Schema({
    verify_code: { type: String, required: true },
    userEmail: { type: String, required: true },
    createdAt: { type: Date, expires: 300 }
}, { versionKey: false, timestamps: true })

export const verifyModel = model('verify', verifySchema)
