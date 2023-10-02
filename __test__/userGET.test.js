const {findUsers} = require('../Controllers/GET/users.controller.js');

describe('Testing for user account', () => { 
    describe('at User.controller.js file', () => {
        it('should get all users', async () => {
            const result = {
                req: {},
                res: {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                }
            }

            await findUsers(req, res)

            const {req, res} = result;
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({status: 200, statusMsg: 'success', users: []});
        })
    })
 })