import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepository from '../data/auth.js';
import coolsms from 'coolsms-node-sdk';
import { config } from '../config.js';

// 인증번호
const apiKey = config.sms.sms_api;
const apiSecret = config.sms.sms_secret;

const sms = coolsms.default;
const messageService = new sms(apiKey, apiSecret);

export let verificationStorage = {}; // verificationStorage를 export합니다.

function generateVerificationCode(length) {
    const numbers = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return code;
  }

// 생성된 인증번호 6자리를 verificationCode에 변환 후 verificationStorage[phoneNumber]에 저장
export async function sendVerificationMessage(HP) {
    const verificationCode = generateVerificationCode(6);
    try {
        const params = {
            to: HP,
            from: config.sms.sendNumber,
            text: `인증 번호는 ${verificationCode}입니다.`
        };
        const response = await messageService.sendOne(params);
        verificationStorage[HP] = verificationCode;
        return { verificationCode, response };
    } catch (error) {
        console.error(error);
        throw new Error('인증번호 전송 실패');
    }
}

// 입력한 전화번호로 인증번호를 전송
export async function sendVerification(req, res) {
    const {HP} = req.body;
    try {
        const verificationCode = await sendVerificationMessage(HP);
    
        res.status(200).json({ message: '인증번호가 전송되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: '인증번호 전송 실패', error: error.message });
    }
}

// 인증코드 반환
export function getVerificationCode(HP) {
    return verificationStorage[HP];
}

// 저장된 인증번호(storedCode)와 입력한 인증번호(verificationCode)를 비교
export async function verifyCode(req, res) {
    const { HP, verificationCode } = req.body;
    console.log();
    try {
        const storedCode = verificationStorage[HP];
        if (verificationCode === storedCode) {
            res.status(200).json({ message: '인증 성공' });
        } else {
            res.status(400).json({ message: '잘못된 인증번호' });
        }
    } catch (error) {
        res.status(500).json({ message: '인증 검증 실패', error: error.message });
    }
}

// 토근 생성
function createJwtToken(id) {
    return jwt.sign({id}, config.jwt.secretKey, {expiresIn:config.jwt.expiresInSec});
} 

// 회원 생성
export async function signUp(req, res) {
    try {
        const {userId, password, HP} = req.body;
        const found = await userRepository.findByID(userId);
        if(found){
            return res.status(409).json({message:`${userId}는 이미 가입된 아이디입니다.`})
        }
        const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
        const user = await userRepository.createUser({
            userId,
            password: hashed,
            HP
        });
        return res.status(201).json(user);
    } catch (error) {
        console.error('회원 생성 중 에러 발생:', error);
        return res.status(500).json({ error: '회원을 생성하는 중 에러가 발생했습니다.' });
    }
}

// 아이디 중복검사
export async function searchId(req, res) {
    const { userId } = req.body;
    console.log(userId,'들어옴');
    try {
        const found = await userRepository.findByID(userId);

        if (found) {
            return res.status(409).json({message: '아이디가 있습니다.'});
        }

        return res.status(200).json({message: '아이디가 없습니다.'});
    } catch (error) {
        console.error('아이디 중복검사 중 에러 발생:', error);
        res.status(500).json({ isUser: 'N', error: '아이디 중복검사 중 에러 발생' });
    }
}

// 로그인
export async function signIn(req, res) {
    // 아이디 비번 받기
    const {userId, password} = req.body;
    // 아이디 중복 검사
    try{
        const user = await userRepository.findByID(userId);

        // 아이디가 없을 시
        if(!user){
            return res.status(401).json({message:'아이디를 확인해주세요'})
        }

        // 입력한 비밀번호와 db에 있는 비밀번호 검사
        let pwCheck = await bcrypt.compare(password, user.password)
        if(!pwCheck){
            return res.status(401).json({message:'비밀번호를 확인해주세요'})
        }
        const token = createJwtToken(user._id);
        return res.status(201).json({token, user})
    } catch (error) {
        console.error('로그인중:', error);
        res.status(500).json({message: '서버에서 에러가 발생하였습니다.'});
    }
}

// 사용자 정보 출력
export async function userInfo(req, res) {
    const {_id} = req.body;
    try{
        const user = await userRepository.findBy_id(_id);
        console.log();
        if(user){
            return res.status(201).json(user)
        }
    }catch(error){
        console.log(error);
    }
}

// 라스트 스테이지 업데이트
export async function modifyLastStage(req, res) {
    const {_id, num} = req.body;
    try{
        const result = await userRepository.updateLastStage(_id, num)
        if(result){
            return res.status(201).json({message:'업데이트 성공'})
        }
    }catch(error){
        console.error(error)
    }
}

// 라스트 스테이지 업데이트
export async function updateConvData(req, res) {
    const {_id, num, data} = req.body;
    try{
        const result = await userRepository.updateConv(_id, num, data)
        if(result){
            return res.status(201).json({message:'업데이트 성공'})
        }
    }catch(error){
        console.error(error)
    }
}

// 스테이지 상태 업데이트
export async function updateCom(req, res) {
    const {_id, num, com} = req.body;
    try{
        const result = await userRepository.updateCom(_id, num, com)
        if(result){
            return res.status(201).json({message:'업데이트 성공'})
        }
    }catch(error){
        console.error(error)
    }
}