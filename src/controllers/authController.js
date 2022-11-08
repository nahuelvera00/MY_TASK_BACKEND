import AuthService from "../services/database/authService";

class AuthController {
  constructor() {}

  //------------------ REGISTER NEW USER --------------------------------

  async register(req, res) {
    const result = await AuthService.createUser(req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.json(result);
  }

  //----------------- CONFIRM ACCOUNT ---------------------

  async confirmAccount(req, res) {
    const { token } = req.params;

    const result = await AuthService.confirmUser(token);

    if (result.error) {
      return res.json(result);
    }
    res.json(result);
  }

  //---------------- LOGIN, RETURN PROFILE -----------------

  async auth(req, res) {
    const { email, password } = req.body;
    const result = await AuthService.authenticate(email, password);

    if (result.error) {
      return res.json(result);
    }
    res.json(result.user);
  }

  // ---------------- RECOVER PASSWORD ----------------------

  async recoverPassword(req, res) {
    const { email } = req.body;
    const result = await AuthService.recoverPass(email);

    if (result.error) {
      return res.json(result);
    }
    res.json(result);
  }

  //------------------------- VALIDATE TOKEN -----------------

  async checkToken(req, res) {
    const { token } = req.params;
    const result = await AuthService.check(token);

    if (result.error) {
      return res.json(result);
    }
    res.json(result);
  }

  //------------------------- NEW PASSWORD  ------------------

  async newPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    const result = await AuthService.updatePassword(token, password);
    if (result.error) {
      return res.json(result);
    }
    res.json(result);
  }
}

module.exports = new AuthController();
