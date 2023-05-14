const { createHash } = require("node:crypto");

const accounts = [
  {
    login: "vinicius",
    password:
      "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
    admin: true,
  },
  {
    login: "vitor",
    password:
      "7b827bc16e9e53a5f16aa71cbef3f22e7c293ba056ec033b2f171007266146d7",
    admin: true,
  },
  {
    login: "paulo",
    password:
      "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    admin: false,
  },
];

/**
 * Return the data's hash hex string
 * @param {string} data
 * @returns {string}
 */
function getHash(data) {
  const hash = createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
}

module.exports = {
  /**
   * Returns the user by the login or undefined if the user doesn't exists
   * @param {string} login
   * @returns {object | undefined}
   */
  getUserByLogin(login) {
    return accounts.find((user) => user.login === login);
  },

  /**
   * Set the oldLogin user to the newLogin and return the user. If the user doesn't exist return false.
   * @param {string} oldLogin
   * @param {string} newLogin
   * @returns {object | undefined}
   */
  setUserLogin(oldLogin, newLogin) {
    const user = this.getUserByLogin(oldLogin);
    if (user === undefined) return false;
    user.login = newLogin;
    return user;
  },

  /**
   * Return true if the password match the login, false otherwise
   * @param {string} login
   * @param {string} password
   * @returns {boolean}
   */
  checkPassword(login, password) {
    const user = this.getUserByLogin(login);
    if (user === undefined) return false;
    const hashPassword = getHash(password);
    return user.password === hashPassword;
  },
};
