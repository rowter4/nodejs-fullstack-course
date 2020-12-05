const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');
const auth = require('../middleware/isAuth');

const router = express.Router();

router.get('/status', auth, authController.getUserStatus);

router.put('/status', auth, [
    body('status')
        .trim()
        .not()
        .isEmpty()
], authController.updateUserStatus);

router.post('/signup', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
             return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 5 }),
    body('name')
        .trim()
        .not()
        .isEmpty()
], authController.signup);

router.post('/login', authController.login);

module.exports = router;