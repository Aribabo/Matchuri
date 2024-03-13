import express from "express";
import {body} from 'express-validator'
import {validate} from '../middleware/validator.js'
import * as authController from '../controller/auth.js'
import {isAuth} from '../middleware/auth.js';

const router = express.Router();

const validateSignup = [
    body('userId')
        .trim()
        .notEmpty()
        .withMessage('아이디는 반드시 입력해야 함')
        .isAlphanumeric() // 영문자/소문자로 구성됐는지 확인
        .withMessage('아이디는 영어 소문자와 숫자만 포함해야 함')
        .isLength({min:4, max:12})
        .withMessage('아이디는 4자에서 12자 사이여야 함'),
    body('password')
        .trim()
        .matches(/^(?=.*[a-zA-Z])(?=.*\d|.*[\W_])[a-zA-Z\d\W_]{6,20}$/) // 영문자, 숫자, 특수 문자 중 2가지 이상 조합
        .withMessage('비밀번호는 영문자(대소문자 상관없이), 숫자, 특수문자 중 2가지 이상을 조합하여 6~20자 이어야 함'),
    body('HP')
        .trim()
        .notEmpty()
        .withMessage('휴대폰 번호를 입력하세요')
        .matches(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/) // 휴대폰 번호 형식인지 확인
        .withMessage('휴대폰 번호를 확인해주세요. (예: 010-1234-5678)'),
    validate
]

const validateLogin = [
    body('userId')
    .trim()
    .notEmpty()
    .withMessage('아이디는 반드시 입력해야 함')
    .isAlphanumeric() // 영문자/소문자로 구성됐는지 확인
    .withMessage('아이디는 영어 소문자와 숫자만 포함해야 함')
    .isLength({min:4, max:12})
    .withMessage('아이디는 4자에서 12자 사이여야 함'),
    body('password')
    .trim()
    .matches(/^(?=.*[a-zA-Z])(?=.*\d|.*[\W_])[a-zA-Z\d\W_]{6,20}$/) // 영문자, 숫자, 특수 문자 중 2가지 이상 조합
    .withMessage('비밀번호는 영문자(대소문자 상관없이), 숫자, 특수문자 중 2가지 이상을 조합하여 6~20자 이어야 함'),
    validate
]

// 아이디 검색 
router.post('/searchId', authController.searchId);

// 사용자 회원가입
router.post('/signUp',validateSignup, authController.signUp);

// 로그인
router.post('/signIn',validateLogin, authController.signIn);

// 메인페이지 사용자 정보 출력
router.post('/info', authController.userInfo)

// 인증번호 전송
router.post('/sendVerification', authController.sendVerification) // const phoneNumber = req.body.phnumber;

// 인증번호 확인
router.post('/verifyCode', authController.verifyCode) // body: phnumber, verificationCode

// 라스트스테이지 업데이트
router.post('/update/last', authController.modifyLastStage) // body: phnumber, verificationCode

// 채팅 업데이트
router.post('/update/text', authController.updateConvData) // body: phnumber, verificationCode

// 스테이지 업데이트
router.post('/update/com', authController.updateCom) // body: phnumber, verificationCode

export default router;