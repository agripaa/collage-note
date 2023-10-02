const Users = require('../../Models/users.model.js');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    async createUser(req, res) {
        const { name, nickname, email, password, confirmPass } = req.body;
        const OTP = module.exports.generateOTP();
        
        if (module.exports.validateNameUser(name)) return res.status(408).json({status: 401, statusMsg: 'Invalid name', message: 'The name you enter must be more than 3 characters and less than 20 characters'})
        if (module.exports.validateNicknameUser(nickname)) return res.status(408).json({status: 401, statusMsg: 'Invalid nickname', message: 'The nickname you enter must be more than 3 characters and less than 10 characters'})

        const validateEmailUser = await Users.findOne({ where: { email }})
        if (validateEmailUser) return res.status(409).json({ status: 409, statusMsg: 'Email already in use', message: 'you must be create account in the new email'})

        if (password !== confirmPass) return res.status(403).json({ status: 403, statusMsg: 'password and confirm password aren\'t same', message: 'password and confirm password must same' })

        bcrypt.hash(password, 10)
        .then(async (salt) => {
            try {
                await Users.create({
                    name,
                    nickname,
                    email: email,
                    password: salt,
                    verifiedCode: OTP
                });
                
                module.exports.sendOTPToEmailUser(OTP, email);
                res.status(200).json({status: 200, statusMsg: 'success', message: 'created user successfully'})
            } catch(err){
                console.error(err);
            }
        })
    },
    validateNameUser(name) {
        return name <= 3 && name >= 35
    },
    validateNicknameUser(nickname) {
        return nickname <= 3 && nickname >= 10
    },
    generateOTP() {
        const digits = '0123456789';
        let OTP = '';
        for (let i = 0; i < 6; i++) {
          OTP += digits[Math.floor(Math.random() * 10)];
        }
        return OTP;
    },
    sendOTPToEmailUser(otp, emailUser) {
        let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            } 
        }));

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: emailUser,
            subject: 'Verification Code',
            text: `Your verification code is ${otp}`
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(new Error('Failed to send mail'))
                } else {
                    resolve();
                }
            })
        })
    },
    async verifyOTPUser(req, res) {
        const { otp } = req.body;

        const user = await Users.findOne({where: { verifiedCode: otp }})
        if (user.verifiedCode !== otp) return res.status(404).json({status: 404, statusMsg: 'otp not found', message: 'please select true otp code'});

        try {
            await Users.update({
                verifiedCode: null
            }, {where: {verifiedCode: user.verifiedCode}});

            res.status(200).json({ status: 200, msg: 'otp approved' });
        } catch (error) {
            console.error(error);
        }
    }
}