import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { InvalidTokenError } from "../errors/TypeError.js";

const secret = process.env.SECRET;

export const hashPassword = (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
    const validatePassword = await bcrypt.compare(password, hash);
    return validatePassword;
};

export const createToken = (data, expiration) => {
    const token = jwt.sign(
        {
            data,
        },
        secret,
        { expiresIn: expiration }
    );
    return token;
};

export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        console.log(error);
        throw new InvalidTokenError()
    }
};
