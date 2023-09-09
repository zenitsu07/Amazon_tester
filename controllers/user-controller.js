const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require("../model/user.js");

dotenv.config(); // In order to use env variables

async function signupController(req, res) {
    try {
        let data = req.body;
        console.log(data);
        const user = { username: req.body.username, name: req.body.name, password: req.body.password }
        console.log(user);

        const newUser = new User(user);
        await newUser.save();

        return res.status(200).json({ msg: 'Signup successful' });

    } catch (error) {
        return res.status(500).json({ msg: 'Error while signing up user' });
    }
}

exports.loginUser = async (request, response) => {
    console.log('login controller');
    
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: "Error username not found" })
    }

    try {
        console.log(request.body.password)
        let match = await bcrypt.compare(request.body.password, user.password)
        
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY, { expiresIn: '15d' })
            console.log(accessToken, refreshToken)

            const newToken = new Token({ token: refreshToken })
            await newToken.save();

            return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username })
        } else {
            return response.status(400).json({ msg: "Password does not match" });
        }
    } catch (error) {
        return response.status(500).json({ msg: 'Error while login the user' })
    }
};
