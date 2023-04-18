import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';

export class Authenticate {
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

    const user = await UserModel.findOne({ username: username });
    res.json(user);
  }

  async updateUser(req, res) {
    res.json('updateUser route');
  }

  async generateOTP(req, res) {
    res.json('generateOTP route');
  }

  async verifyOTP(req, res) {
    res.json('verifyOTP route');
  }

  async createResetSession(req, res) {
    res.json('createResetSession route');
  }

  async resetPassword(req, res) {
    res.json('resetPassword route');
  }
}
