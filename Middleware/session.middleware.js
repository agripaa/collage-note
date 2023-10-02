const Users = require('../Models/users.model.js');

module.exports = {
    async sessionUser(req, res, next){
        const {userUUID} = req.session;
        if(!userUUID) return res.status(401).json({status:401, msg: "Please Login your account"}) 

        const user = await Users.findOne({
            where: {uuid: userUUID},
            attributes: ['name', 'nickname', 'email', 'verifiedCode']
        })

        if(!user) return res.status(404).json({status: 404, msg: 'User not found'});
        if(user.verifiedCode !== null) return res.status(412).json({status:412, msg: "User hasn't verified"})
    }
}