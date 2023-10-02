const Users = require('../../Models/users.model.js');
const bcrypt = require('bcrypt');

module.exports = {
    async loginUser(req, res) {
        const { email, password } = req.body;
        if(req.userUUID) return res.status(402).json({status: 403, msg: 'You are already logged in, please return to the dashboard'})

        const user = Users.findOne({
            where: {email}
        });

        console.log(user.verifiedCode)

        if(!user) return res.status(404).json({status: 404, msg: "User not found"});
        if(user.verifiedCode) return res.status(403).json({status:403, msg: "User Must verify verification code"});

        const matchingPassword = bcrypt.compare(user.password, password);
        if (!matchingPassword) return res.status(400).json({status:400, msg: "Password do not matches"})

        const { uuid, name, nickname } = user;
        req.session.userUUID = uuid;
        res.status(200).json({status:200, statusMsg: 'login successful', result: {uuid, name, nickname}});
    }
}