import Mongoose from "mongoose";


const stageSchema = new Mongoose.Schema({
    N: {type: Number, unique: true, required: true },
    Q: {type: String, required: true},
    H: {type: Mongoose.Schema.Types.Mixed, required: true},
    L: {type: Number, required: true},
    T: {type: String, required: true},
    S: {type: String, required: true},
    A: {type: String, required: true}
});

const Stage = Mongoose.model("2stage", stageSchema);

// 스테이지 ALL출력
export async function findAll() {
    try{
        const data = await Stage.find()
        return data;
    }catch(error){
        console.error(error);
    }
}

// 스테이지 개별 출력
export async function findByN(N) {
    try{
        const data = await Stage.find({N:N})
        return data[0];
    }catch(error){
        console.error(error);
    }
}
