import Mongoose from "mongoose";

// const userSchema = new Mongoose.Schema({
//     userId: {type: String, unique: true, required: true },
//     password:  {type: String, required: true},
//     HP: {type: String, required: true},
//     isAdmin: {type: String},
//     solved_stage: {type: Mongoose.Schema.Types.Mixed},
//     last_stage: {type: String},
//     conversation:{type: Mongoose.Schema.Types.Mixed}
// },
// {timestamps: true});
const userSchema = new Mongoose.Schema({
    userId: {type: String, unique: true, required: true },
    password:  {type: String, required: true},
    HP: {type: String, required: true},
    isAdmin: {type: String},
    last_stage: {type: String},
    conversation:{type: Mongoose.Schema.Types.Mixed}
},
{timestamps: true});

const User = Mongoose.model("user", userSchema);

// 사용자 탐색
export async function findByID(userId) {
    try{
        const data = await User.find({userId:userId}).sort({createdAt : -1})
        return data[0];
    }catch(error){
        console.error(error);
    }
}

// 고유아이디로 검색
export async function findBy_id(_id) {
    try{
        const data = await User.findById(_id)
        return data
    }catch(error){
        console.error(error)
    }
}

// 회원가입
export async function createUser(user) {
    try{
        const {userId , password, HP} = user;
        
        const newUser = new User({
            userId, 
            password, 
            HP, 
            isAdmin:'N',
            last_stage:"0",
            conversation:{
                1:{"text":'',"com":0},
                2:{"text":'',"com":0},
                3:{"text":'',"com":0} /* 0:진행안함, 1:진행중. 2: 완료 */
            }
        });

        return newUser.save().then((data) => {return data});

    }catch(error){
        console.error(error)
    }
}

// 마지막 스테이지 업데이트
export async function updateLastStage(_id, num) {
    try{
        return User.findByIdAndUpdate(
            _id,
            {last_stage:num}
        )
    }catch(error){
        console.error(error)
    }
}

// 채팅 기록 업데이트
export async function updateConv(_id, num, data) {
    try{
        const updateQuery = {};
        updateQuery[`conversation.${num}.text`] = data;

        return User.findByIdAndUpdate(_id, updateQuery);
    }catch(error){
        console.error(error)
    }
}

// 스테이지 진행상태 업데이트
export async function updateCom(_id, num, com) {
    try{
        const updateQuery = {};
        updateQuery[`conversation.${num}.com`] = com;

        return User.findByIdAndUpdate(_id, updateQuery)
    }catch(error){
        console.error(error)
    }
}