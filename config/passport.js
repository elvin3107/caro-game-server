const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusStrategy = require('passport-google-plus');
const { ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

passport.use('jwt', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: process.env.TOKEN_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if(!user) return done(null, false);
        done(null, user);
    } catch(err) {
        done(err, false);
    }
}));

passport.use('local', new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            email: email,
            accessType: 'email'
        });
        if(!user) return done(null, true, { message: "Tài khoản hoặc mật khẩu sai"});
        if(user.active === '3' || user.active === '4') return done(null, true, { message: "Tài khoản bạn đã bị khóa"});
        if(user.active === '1') return done(null, true, { message: "Tài khoản chưa được kích hoạt !! Kiểm tra email của bạn để kích hoạt tài khoản"});
        
        const checkPassword = await user.isValidPassword(password);
        if(!checkPassword) return done(null, true, { message: "Tài khoản hoặc mật khẩu sai"});

        done(null, user);
    } catch(err) {
        return done(err, false);
    }
}));

passport.use('jwt-active-account', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromBodyField('token'),
    secretOrKey: process.env.TOKEN_SECRET_1
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if(!user) return done(null, false);
        done(null, user);
    } catch(err) {
        done(err, false);
    }
}));

passport.use('jwt-forget-password', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromBodyField('token'),
    secretOrKey: process.env.TOKEN_SECRET_2
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if(!user) return done(null, false);
        done(null, user);
    } catch(err) {
        done(err, false);
    }
}));