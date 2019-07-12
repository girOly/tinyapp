const bcrypt = require("bcrypt");
// Generates Random URL ID
const generateRandomString = function() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
};
// Checks Password inout with Hashed Database
const checkPassword = function(password, users) {
  for (let userId in users) {
    if (bcrypt.compareSync(password, users[userId].password)) {
      return users[userId].id;
    }
  }
  return false;
};
// Finds Email in Users Database
const findEmail = function(email, users) {
  for (let user in users) {
    if (email === users[user].email) {
      return true;
    } else {
    }
  }
  return false;
};
// Adds new User to Database
const addNewUser = function(email, password, users) {
  let salt = bcrypt.genSaltSync(10);
  let id = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, salt);
  users[id] = { id, email, password: hashedPassword };
  return id;
};
// Filters URL Database with logged User
const filterUrls = function(userId, urlDatabase) {
  const filteredData = {};
  for (let shortURLs in urlDatabase) {
    if (urlDatabase[shortURLs].userID === userId) {
      filteredData[shortURLs] = urlDatabase[shortURLs];
    }
  }
  return filteredData;
};

// Gets User ID/Session by Email
const getUserByEmail = function(email, users) {
  for (let userId in users) {
    if (email === users[userId].email) {
      return users[userId].id;
    }
  }
  return undefined;
};
// Edits the Long URL
const urlEdit = (Id, longURL, Session, urlDatabase) => {
  console.log(Id);
  console.log(longURL);
  console.log(Session);
  urlDatabase[Id] = { longURL, Session };
};

// ---- Module Exports
module.exports = {
  generateRandomString,
  findEmail,
  addNewUser,
  checkPassword,
  filterUrls,
  getUserByEmail,
  urlEdit
};
