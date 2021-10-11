const jwt = require('jsonwebtoken');
const { BadRequest, } = require('http-errors');
const { User } = require('../dbase');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (user) => {
    return { 
        accessToken: jwt.sign({ id: user.id, }, process.env.SECRET_KEY_JWT, { expiresIn: 60*60 }),
        refreshToken: jwt.sign({ id: user.id, refresh: true, }, process.env.SECRET_KEY_JWT, { expiresIn: 60*60*30 })
    }
}

const searchRefreshToken = (cookie) => {
    const arrCookie = cookie.split(';');
    for (let lineCookie of arrCookie) {
        const arrLineCookie = lineCookie.trim().split('=');
        if (arrLineCookie[0].trim() === 'refreshToken') return arrLineCookie[1].trim();
    }
    return false;
}

const signin = async (req, res) => {
    if (req.body.hasOwnProperty("login") && req.body.hasOwnProperty("password")) {
        const user = await User.findOne({
            where: {
                login: req.body.login
            }
        });
        if (user !== null) {
            const checkPassword = await bcrypt.compare(req.body.password, user.password);
            if (checkPassword) {
                const tokens = generateToken(user);
                res.setHeader('Set-Cookie', `refreshToken=${tokens.refreshToken}; HttpOnly`);
                return res.status(201).json({
                    accessToken: tokens.accessToken
                });
            }
            throw new BadRequest("Invalid password");
        } else return res.status(204).json({
            msg: "User not found"
        });
    }
    throw new BadRequest("Invalid parameters");
}

const signup = async (req, res) => {
    if (req.body.hasOwnProperty("login") && req.body.hasOwnProperty("password")) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        const { login, password } = req.body;
        const resultCreateUser = await User.create({ login, password })
        .catch((err) => {
            if (err.original.code === '23505') throw new BadRequest("Login already exists");
            else throw new BadRequest("DB error");
        });
        return res.status(201).json(resultCreateUser.GetUser());
    }
    throw new BadRequest("Invalid parameters");
}

const refresh = (req, res) => {
    const refreshToken = searchRefreshToken(req.headers.cookie);
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT);
            if (decoded.refresh) {
                const tokens = generateToken(decoded);
                res.setHeader('Set-Cookie', `refreshToken=${tokens.refreshToken}; HttpOnly`);
                return res.status(201).json({
                    accessToken: tokens.accessToken
                });
            }
            throw new BadRequest("Invalid token");
        } catch (error) {
            throw new BadRequest("Invalid token");
        }
    }
    throw new BadRequest("Token not found");
}

module.exports = {
    signin,
    signup,
    refresh
};