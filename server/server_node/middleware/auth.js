import jwt from "jsonwebtoken"
import * as userRepository from "../data/auth.js"
import {config} from "../config.js"

const AUTH_ERROR = { message: '인증 에러!'};

export const isAuth = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!(authHeader && authHeader.startsWith('Bearer '))) {
        return res.status(401).json({ result: '실패', message: '권한이 없습니다. 다시 로그인을 해주세요' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                console.log('Token expired at:', error.expiredAt);
                return res.status(401).json({ result: '실패', message: '토큰이 만료되었습니다. 다시 로그인을 해주세요' });
            }
            console.error('Token verification error:', error);
            return res.status(401).json({ result: '실패', message: '권한이 없습니다. 다시 로그인을 해주세요' });
        }
        req.id = decoded.id;
        next();
    }
);
}