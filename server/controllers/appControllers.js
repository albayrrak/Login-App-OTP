import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';

export class Authenticate {
  async verifyUser(req, res, next) {
    try {
      const { username } = req.method == 'GET' ? req.query : req.body;
      let exist = await UserModel.findOne({ username });
      if (!exist) return res.status(404).json({ error: "Can't find User" });
      next();
    } catch (error) {
      res.status(404).json({ error: 'Authentication Error' });
    }
  }

  async register(req, res) {
    try {
      const { username, password, profile, email } = req.body;

      // check for existing username and email
      const checkUsername = await UserModel.findOne({ username });
      const checkEmail = await UserModel.findOne({ email });

      // New user
      if (!checkUsername && !checkEmail) {
        if (!password) {
          res.json({ msg: 'Password required' });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = await new UserModel({
            username,
            password: hashedPassword,
            email,
            profile,
          });

          newUser
            .save()
            .then((result) =>
              res.status(201).send({ msg: 'Registered Succesfully' })
            );
        }
      } else {
        res.json({ msg: 'User existing' });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const currentUser = await UserModel.findOne({ username });
      if (currentUser) {
        const decodePassword = await bcrypt.compare(
          password,
          currentUser.password
        );
        if (decodePassword) {
          const token = jwt.sign(
            {
              userId: currentUser._id,
              username: currentUser.username,
            },
            ENV.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.status(200).json({
            msg: 'Login Successfull',
            username: currentUser.username,
            token: token,
          });
        } else {
          res.json({ msg: 'Password does not match' });
        }
      } else {
        res.status(404).res.json({ msg: 'User not found' });
      }
    } catch (error) {
      return res.status(500).send({ error });
    }
  }

  async getUser(req, res) {
    const { username } = req.params;
    console.log(username);

    try {
      if (!username) return res.status(501).json({ error: 'Invalid username' });
      const currentUser = await UserModel.findOne({ username });

      if (!currentUser) {
        res.status(404).json({ msg: 'user not found' });
      } else {
        const { password, ...rest } = Object.assign({}, currentUser.toJSON());
        res.status(200).json(rest);
      }
    } catch (error) {
      return res.status(404).json({ error: "Can't find user data" });
    }
  }

  async updateUser(req, res) {
    try {
      const { userId } = req.user;
      console.log(userId);

      if (userId) {
        const body = req.body;
        const currentUser = await UserModel.findOne({ _id: userId });
        currentUser.username = body.username;
        currentUser.email = body.email;
        currentUser.profile = body.profile;
        currentUser.save();
        res.json(currentUser);
      } else {
        return res.status(401).json({ error: 'User not found' });
      }
    } catch (error) {
      return res.status(401).json({ error });
    }
  }

  async generateOTP(req, res) {
    console.log(req.app);
    req.app.locals.OTP = await otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    res.status(201).json({ code: req.app.locals.OTP });
  }

  async verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(201).json({ msg: 'Verify Successfully' });
    }
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  async createResetSession(req, res) {
    if (req.app.locals.resetSession) {
      req.app.locals.resetSession = false;
      return res.status(201).send({ msg: 'access granted' });
    }
    return res.status(440).json({ error: 'Session expired' });
  }

  async resetPassword(req, res) {
    try {
      if (!req.app.locals.resetSession)
        return res.status(440).json({ error: 'Session expired' });
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const currentUser = await UserModel.updateOne(
        { username },
        { password: hashedPassword }
      );
      if (currentUser) {
        req.app.locals.resetSession = false;
      }
      res.status(201).json({ msg: 'User password changed' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
