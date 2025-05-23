"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('MongoDB connection string is not defined in environment variables');
            process.exit(1);
        }
        const conn = yield mongoose_1.default.connect(mongoUri, {
            // These options help with connection issues
            serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
            socketTimeoutMS: 60000, // Increase socket timeout to 60s
            family: 4, // Force IPv4
            retryWrites: true,
            retryReads: true,
            maxPoolSize: 10, // Maintain up to 10 socket connections
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        // Log more detailed error information
        if (error instanceof Error) {
            console.error(`Error details: ${error.message}`);
            if ('cause' in error) {
                console.error('Cause:', error.cause);
            }
        }
        process.exit(1);
    }
});
exports.default = connectDB;
