const bcrypt = require("bcrypt");
const generateRandomString = function() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
};
const checkPassword = function(password, users) {
  console.log("Finding Password");
  console.log("-".repeat(30));
  for (let userId in users) {
    if (bcrypt.compareSync(password, users[userId].password)) {
      return users[userId].id;
    }
  }
  return false;
};

const findEmail = function(email, users) {
  for (let user in users) {
    if (email === users[user].email) {
      return true;
    } else {
    }
  }
  return false;
};

const addNewUser = function(email, password, users) {
  let salt = bcrypt.genSaltSync(10);
  let id = generateRandomString();
  console.log("Password:", password);
  const hashedPassword = bcrypt.hashSync(password, salt);
  users[id] = { id, email, password: hashedPassword };
  return id;
};

const filterUrls = function(userId, urlDatabase) {
  const filteredData = {};
  for (let shortURLs in urlDatabase) {
    if (urlDatabase[shortURLs].userID === userId) {
      filteredData[shortURLs] = urlDatabase[shortURLs];
    }
  }
  return filteredData;
};

const getUserByEmail = function(email, users) {
  for (let userId in users) {
    if (email === users[userId].email) {
      return users[userId].id;
    }
  }
  return undefined
};

module.exports = {
  generateRandomString,
  findEmail,
  addNewUser,
  checkPassword,
  filterUrls,
  getUserByEmail
};
