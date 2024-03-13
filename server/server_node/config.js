import dotenv from "dotenv"

dotenv.config();

function required(key, defaultValue = undefined){
    const value = process.env[key] || defaultValue;
    if (value == null){
        throw new Error(`key ${key} is undefined`);
    }
    return value;
}

export const config = {
    jwt: {
        secretKey: required('JWT_SECRET'),
        expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 172800))
    },
    bcrypt: {
        saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12))
    },
    host: {
        port: parseInt(required('HOST_PORT', 8080))
    },
    db: {
        host: required('DB_HOST')
    },
    sms: {
        sms_api: required('sms_api'),
        sms_secret: required('sms_secret'),
        sendNumber: required('sendNumber')
    }
}
