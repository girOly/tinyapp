const bcrypt = require("bcrypt");
console.log(bcrypt);
const generateRandomString = function() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
};
const checkPassword = function(password, users) {
  console.log("Finding Password");
  console.log('-'.repeat(30));
  for (let userId in users) {
    console.log('user:', userId);
    console.log("hashedPassword:", users[userId].password, "text password:", password);
    if (bcrypt.compareSync(password, users[userId].password)) {
      return users[userId].id;
    }
  }
  return false;
};

const findEmail = function(email, users) {
  // console.log("Finding Email");
  for (let user in users) {
    // console.log(user);
    if (email === users[user].email) {
      // console.log("true");
      return true;
    } else {
      // console.log("false");
      // console.log(users[user].email);
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

module.exports = {
  generateRandomString,
  findEmail,
  addNewUser,
  checkPassword,
  filterUrls
};
