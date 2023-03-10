const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');
const { SECRET } = require('../constants');

exports.findByUsername = (username) => User.findOne({ username });

exports.findByEmail = (email) => User.findOne({ email });

exports.register = async (email, firstName, lastName, password, rePass) => {
    if (password !== rePass) {
        throw new Error('Password mismatch!');
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error('User exists!');
    }

    if (password.length < 5) {
        throw new Error('Password too short!');
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ email, firstName, lastName, password: hashedPassword });

    return this.login(email, password);
};

exports.login = async (email, password) => {
    const user = await this.findByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password!');
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new Error('Invalid email or password!');
    }

    const payload = {
        _id: user._id,
        email,
        username: user.username,
    };

    const token = await jwt.sign(payload, SECRET)

    return token;
};
