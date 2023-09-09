const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require("../model/user.js");

dotenv.config(); // In order to use env variables

async function signupController(req, res) {

    try {
      
        let data = req.body;
        console.log(data);
        
        let newUser = await User.create(data);
        console.log(newUser);
         
        newUser.save()
        .then(() => {
            console.log('New user added.');
        })
        .catch((error) => {
            console.log('Error adding new user:', error);
        });


        res.status(201).json({
            result: "User Signed Up"
        });
    } catch (err) {
        res.status(400).json({
            result: err.message
        }
        );
    }
}


async function loginController(req, res) {
  try {
    const data = req.body;
    const { email, password } = data;
    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {

          console.log(data)
          const token = jwt.sign(
            {
              data: user['_id'],
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expiration time (24 hours)
            },
            process.env.JWTSECRET
          );
          // res.cookie('JWT', token, {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === 'production', // Set 'secure' to true in production (HTTPS)
          //   sameSite: 'strict', // Adjust this according to your requirements
          // });

          user.password = undefined;
          user.confirmPassword = undefined;
          console.log('login', user);
          
          res.status(200).json({ user });

        } else {
          res.status(400).json({ result: 'Email or password does not match' });
        }
      } else {
        res.status(404).json({ result: 'User not found' });
      }

    } else {
      res.status(400).json({ result: 'User not found, kindly sign up' });
    }
  } catch (err) {
    res.status(500).json({ result: err.message });
  }
}

// async function loginController(req, res) {
//   try {
//     const data = req.body;
//     const { email, password } = data;

//     // Check if email and password match specific values from environment variables
//     if (email === process.env.APP_EMAIL && password === process.env.APP_PASSWORD) {
     
//       // Create a token for this custom user object
//       const token = jwt.sign(
//         {
//           data: user, // Include the custom user object in the token payload
//           exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // Token expiration time (24 hours)
//         },
//         process.env.JWTSECRET
//       );

//       // Set the JWT token in a cookie
//       res.cookie('JWT', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production', // Set 'secure' to true in production (HTTPS)
//         sameSite: 'strict', // Adjust this according to your requirements
//       });

//       // Respond with the custom user object without the actual password
//       user.password = undefined;
//       user.confirmPassword = undefined;
//       console.log('login', user);
//       res.status(200).json({ user });
//     } else {
//       res.status(400).json({ result: 'Email or password does not match' });
//     }
//   } catch (err) {
//     res.status(500).json({ result: err.message });
//   }
// }


module.exports = {
    signupController,
    loginController
}


// async function signupController(req, res) {
//     try {
//         let data = req.body;
//         console.log(data);
//         const user = { username: req.body.username, name: req.body.name, password: req.body.password }
//         console.log(user);

//         const newUser = new User(user);
//         await newUser.save();

//         return res.status(200).json({ msg: 'Signup successful' });

//     } catch (error) {
//         return res.status(500).json({ msg: 'Error while signing up user' });
//     }
// }

// exports.loginUser = async (request, response) => {
//     console.log('login controller');
    
//     let user = await User.findOne({ username: request.body.username });
//     if (!user) {
//         return response.status(400).json({ msg: "Error username not found" })
//     }

//     try {
//         console.log(request.body.password)
//         let match = await bcrypt.compare(request.body.password, user.password)
        
//         if (match) {
//             const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
//             const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY, { expiresIn: '15d' })
//             console.log(accessToken, refreshToken)

//             const newToken = new Token({ token: refreshToken })
//             await newToken.save();

//             return response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, name: user.name, username: user.username })
//         } else {
//             return response.status(400).json({ msg: "Password does not match" });
//         }
//     } catch (error) {
//         return response.status(500).json({ msg: 'Error while login the user' })
//     }
// };
