const JWT = require('jsonwebtoken');
const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const mailgun = require("mailgun-js");

const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

signToken = user => {
    return JWT.sign({
        id: user._id,
        iat: new Date().getTime()
    }, process.env.TOKEN_SECRET);
}

signActivationToken = user => {
    return JWT.sign({
        id: user._id,
        iat: new Date().getTime()
    }, process.env.TOKEN_SECRET_1);
}

signResetPasswordToken = user => {
    return JWT.sign({
        id: user._id,
        iat: new Date().getTime()
    }, process.env.TOKEN_SECRET_2, { expiresIn: '1h' });
}

module.exports = {
    signUp: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existUser = await User.findOne({ email: email, accessType: 'email' });
            if(existUser) return res.status(403).json({
                message: 'Email đã tồn tại'
            });

            const newUser = new User({
                name: name,
                email: email,
                password: password,
                accessType: 'email'
            });
            await newUser.save();

            const token = signActivationToken(newUser);
            const data = {
                from: 'gamecaro@gmail.com',
                to: email,
                subject: 'Kích hoạt tài khoản',
                // html: `
                //     <h2>Xin chào ${name},</h2>
                //     <p></p>
                //     <p>Nhấn vào link bên dưới xác nhận tài khoản của bạn:</p>
                //     <p>${process.env.CLIENT_DOMAIN}/account/activate/${token}</p>
                // `
                html: `
                    <h2>Xin chào ${name},</h2>
                    <p></p>
                    <p>Nhấn vào link bên dưới xác nhận tài khoản của bạn:</p>
                    <p>${process.env.CLIENT_TEST_DOMAIN}/account/activate/${token}</p>
                `
            };

            mg.messages().send(data, function (error, body) {
                console.log(body);
                if(error) return res.status(403).json({
                    message: 'Can not send email'
                });
            });

            res.status(200).json({ message: "Đăng ký thành công!! Kiểm tra email của bạn để kích hoạt tài khoản" });

        } catch(err) {
            res.status(404).json({ err });
        }
    },
    signIn: async (req, res) => {
        if(!_.isEmpty(req.authInfo)) {
            return res.status(401).json(req.authInfo);
        }
        const token = signToken(req.user);
        res.status(200).json({ token })
    },
    getUser: async (req, res) => {
        res.status(200).json(req.user);
    },
    activeAccount: async (req, res) => {
        try {
            if (req.user.active === '3' || req.user.active === '4' ) res.status(404).json({ result: false });
            const user = await User.findByIdAndUpdate(req.user._id, {
                active: '2'
            }, { new: true });

            res.status(200).json({ result: true });
        } catch(err) {
            res.status(404).json({ result: false });
        }
    },
    forgetPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const existUser = await User.findOne({ email: email, accessType: 'email' });
            if(!existUser) return res.status(403).json({
                message: 'Không tìm thấy email'
            });

            const token = signResetPasswordToken(existUser);
            const data = {
                from: 'gamecaro@gmail.com',
                to: email,
                subject: 'Reset mật khẩu',
                html: `
                    <h2>Xin chào ${existUser.name},</h2>
                    <p></p>
                    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
                    <p>Nhập mã đặt lại mật khẩu sau đây:</p>
                    <p><b>${token}</b></p>
                `
            };

            mg.messages().send(data, function (error, body) {
                console.log(body);
                if(error) return res.status(403).json({
                    message: 'Can not send email'
                });
            });

            res.status(200).json({ result: true });
        } catch(err) {
            res.status(404).json({ result: false });
        }
    },
    confirmToken: async (req, res) => {
        if(!_.isEmpty(req.authInfo)) {
            return res.status(401).json({ result: false });
        }
        res.status(200).json({ result: true });
    },
    resetPassword: async (req, res) => {
        try {
            const sail = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(req.body.password, sail);

            const user = await User.findByIdAndUpdate(req.user._id, {
                password: passwordHash
            }, { new: true });

            res.status(200).json({ result: true });
        } catch(err) {
            res.status(404).json({ result: false });
            console.log(err);
        }
    },
    profile: async (req, res) => {
        try {
            let data;
            if(req.body.password) {
                const sail = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(req.body.password, sail);
                data = {
                    email: req.body.email,
                    password: passwordHash
                }
            } else { 
                data = req.body;
            }
            const existUser = await User.findOneAndUpdate(
               { "email" : req.body.email, "accessType": req.body.accessType }, data);
            res.status(200).json({ msg:"Update successfully!" });
        }
        catch(e){
            res.status(400).json({ msg:"Failed in update user: " + e });
        }
    },
    getAnotherUserByEmail: async (req, res) => {
        try{
            const existUser = await User.findOne({ "email": req.body.email });
            res.status(200).json(existUser);
        }
        catch(e){
            res.status(400).json({ msg:"Failed in get user: " + e });
        }
    },
    getUserById: async (req, res) => {
        try{
            const existUser = await User.findById(req.params.id);
            res.status(200).json(existUser);
        }
        catch(e){
            res.status(400).json({ msg:"Failed in get user: " + e });
        }
    },
    getTopPlayers: async (req, res) => {
        try{
            const existUser = await User.find({}, ['_id','name','avatar','rank','elo','game'], // Columns to Return
            {
                skip:0, // Starting Row
                sort:{
                    elo: -1 //Sort by elo
                }
            });
            res.status(200).json(existUser);
        }
        catch(e){
            res.status(400).json({ msg:"Failed in get user: " + e });
        }
    },
}