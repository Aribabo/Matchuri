import Mongoose from "mongoose"
import {config} from "../config.js"

export async function connectDB(){
    return Mongoose.connect(config.db.host, {dbName:'Matchuri'});
}