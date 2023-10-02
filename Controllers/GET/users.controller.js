const Users = require('../../Models/users.model.js');

module.exports = {
    async findUsers (req, res) {
        try {
            const users = await Users.findAll();
            res.status(200).json({status: 200, statusMsg: 'Success', users});
        } catch (err) {
            console.error(err);
        }
    },
}