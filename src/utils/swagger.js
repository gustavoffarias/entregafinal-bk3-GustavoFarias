import __dirname from "./index.js";
import { resolve } from 'path';
const basename =  resolve(__dirname,"../docs/**/*.yaml");

export const  swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API description'
        }
    },
    apis: [basename]
}