const generateRandomString = function() {
  return Math.random()
    .toString(36)
    .substr(2, 5);
};
const checkPassword = function(password, users) {
  console.log("Finding Password");
  for (let user in users) {
    console.log(user);
    if (user.password === password) {
      return true;
    } else {
      return false;
    }
  }
};

const findEmail = function(email, users) {
  // console.log("Finding Email");
  for (let user in users) {
    console.log(user);
    if (email === users[user].email) {
      console.log("true");
      return true;
    } else {
      console.log("false");
      console.log(users[user].email);
    }
  }
  return false;
};

const addNewUser = function(email, password, users) {
  let id = generateRandomString();
  users[id] = { id, email, password };
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
