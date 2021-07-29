const express = require('express');
const router = express.Router();
const passport = require('passport');
const passportConf = require('../config/passport');

const { validateBody, schemas } = require('../validations/authValidation');
const UserController = require('../controllers/user');

router.post('/signup', validateBody(schemas.signupSchema), UserController.signUp);
router.post('/signin', validateBody(schemas.signinSchema), passport.authenticate('local', { session: false }), UserController.signIn);
router.get('/', passport.authenticate('jwt', { session: false }), UserController.getUser);

router.post('/active', passport.authenticate('jwt-active-account', { session: false }), UserController.activeAccount);
router.post('/forgetPassword', validateBody(schemas.forgetPasswordSchema), UserController.forgetPassword);
router.post('/confirmToken', passport.authenticate('jwt-forget-password', { session: false }), UserController.confirmToken);
router.post('/resetPassword', validateBody(schemas.resetPasswordSchema), passport.authenticate('jwt-forget-password', { session: false }), UserController.resetPassword);
router.patch('/profile', passport.authenticate('jwt', { session: false }), UserController.profile);

router.get('/topPlayers',  passport.authenticate('jwt', { session: false }), UserController.getTopPlayers);
router.get('/:id', passport.authenticate('jwt', { session: false }), UserController.getUserById);

module.exports = router;