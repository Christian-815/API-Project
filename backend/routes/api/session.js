const express = require('express');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
        const { user } = req;
        if (user) {
            return res.json({
                user: user.toSafeObject()
            });
        } else return res.json({ user: null });
    }
);

// Log in
router.post(
    '/',
    // validateLogin,
    async (req, res, next) => {
        const { credential, password } = req.body;

        if (!credential) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "error": {
                    "credentials": "Email or Username is required"
                }
            })
        };
        if (!password) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "error": {
                    "password": "Password is required"
                }
            })
        };

        const user = await User.login({ credential, password });

        // if (!user) {
        //     const err = new Error('Login failed');
        //     err.status = 401;
        //     err.title = 'Login failed';
        //     err.errors = { credential: 'The provided credentials were invalid.' };
        //     return next(err);
        // };

        if (!user) {
            return res.status(401).json({
                "message": "Invalid Credentials",
                "statusCode": 401
            })
        }

        await setTokenCookie(res, user);

        return res.json({
            user: user
        });
    }
);

// Log out
router.delete(
    '/',
    (_req, res) => {
        res.clearCookie('token');
        return res.json({ message: 'success' });
    }
);




module.exports = router;
