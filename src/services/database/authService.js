import User from "../../models/User";
import Helper from "../../helpers/helper";
import {
  sendEmailRegister,
  sendEmailRecoverPassword,
} from "../../helpers/sendEmail";

class AuthService {
  constructor() {}

  async createUser(data) {
    const { email } = data;
    //VERIFY DATA
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      const error = new Error("Already registered user");
      return { error: true, msg: error.message };
    }
    //CREATE USER
    try {
      const user = new User(data);
      user.token = Helper.generateToken();
      await user.save();

      //SEND EMAIL
      await sendEmailRegister({
        email,
        name: data.name,
        token: user.token,
      });

      return {
        error: false,
        msg: "User created correctly, check your email to confirm your account",
      };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server error" };
    }
  }

  async confirmUser(token) {
    const user = await User.findOne({ token: token });
    if (!user) {
      const error = new Error("Invalid Token");
      return { error: true, msg: error.message };
    }
    try {
      user.confirmed = true;
      user.token = "";
      await user.save();
      return { error: false, msg: "User confirmed successfully" };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server error" };
    }
  }

  async authenticate(email, password) {
    const user = await User.findOne({ email: email }).select(
      "-createdAt -updatedAt"
    );

    if (!user) {
      const error = new Error("User does not exist");
      return { error: true, msg: error.message };
    }

    if (!user.confirmed) {
      const error = new Error("Unverified account");
      return { error: true, msg: error.message };
    }

    if (await user.comparePassword(password)) {
      return {
        error: false,
        user: {
          _id: user._id,
          name: user.name,
          surname: user.surname,
          email: user.email,
          profileImage: user.profileImage,
          token: Helper.generateJWT(user._id),
        },
      };
    } else {
      const error = new Error("Invalid password");
      return { error: true, msg: error.message };
    }
  }

  async recoverPass(email) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User does not exist");
      return { error: true, msg: error.message };
    }

    try {
      user.token = Helper.generateToken();
      await user.save();

      //SEND EMAIL
      sendEmailRecoverPassword({
        email,
        name: user.name,
        token: user.token,
      });
      return {
        error: false,
        msg: "We send you an email so you can recover your password",
      };
    } catch (error) {
      console.log(error);
      return { error: true, msg: "Server error" };
    }
  }

  async check(token) {
    const validToken = await User.findOne({ token: token });
    if (!validToken) {
      const error = new Error("Invalid token");
      return { error: true, msg: error.message };
    }
    return { error: false, msg: "Valid Token" };
  }

  async updatePassword(token, password) {
    const user = await User.findOne({ token });

    if (user) {
      user.password = password;
      user.token = "";

      try {
        await user.save();
        return { error: false, msg: "Your password was successfully reset" };
      } catch (error) {
        console.log(error);
        return { error: true, msg: "Server error" };
      }
    } else {
      const error = new Error("Invalid token");
      return { error: true, msg: error.message };
    }
  }
}

module.exports = new AuthService();
