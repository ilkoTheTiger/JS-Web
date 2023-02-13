const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (username, email, password, rePass) => {
    if (password !== rePass) {
        throw new Error('Password mismatch!');
    }


    await User.create({ username, email, password, rePass })
}
