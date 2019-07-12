// Express - bodyParser - cookieSession - bcrypt - helpers(Functions Index)
const express = require("express");
const app = express(); // Express Framework
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const helpers = require("./helpers");
const {
  findEmail,
  generateRandomString,
  addNewUser,
  checkPassword,
  filterUrls,
  urlEdit
} = require("./helpers");

app.use(
  cookieSession({
    name: "session",
    keys: ["user_id"],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // Session lasts for 24 hours
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// _____________________________________________________________________________
// urlDatabase - usersDatabase (To be imported into proper Database at later date)

const urlDatabase = {
  // Test Urls
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};
const users = {
  // Test Users
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur" // New Passwords are hashed by bcrypt
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk" //  ^^^
  }
};
// Redirects to main index - If not logged in, redirected to Login Page
app.get("/", (req, res) => {
  res.redirect("/urls");
});
// Server Confirmation
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
// Renders New Url page if logged in, else redirected to Login Page
app.get("/urls/new", (req, res) => {
  userId = req.session.user_id ? req.session.user_id : "";
  let templateVars = { urls: urlDatabase, user: users[userId] };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});
// Renders URL Index
app.get("/urls", (req, res) => {
  userId = req.session.user_id ? req.session.user_id : "";
  let filteredData = filterUrls(userId, urlDatabase);
  let templateVars = {
    user: users[userId],
    urls: filteredData
  };
  res.render("urls_index", templateVars);
});
// Renders Created URL
app.get("/urls/:shortURL", (req, res) => {
  userId = req.session.user_id ? req.session.user_id : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});
// Renders Register page
app.get("/register", (req, res) => {
  userId = req.session.user_id ? req.session.user_id : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_register", templateVars);
});
// Renders Log-In page
app.get("/login", (req, res) => {
  userId = req.session.user_id ? req.session.user_id : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_login", templateVars);
});
// receives created url post, redirects to ShortURL page
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});
// Implements long-url inside of shortened link
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
// Delete Url
app.post("/urls/:id/delete", (req, res) => {
  let { id } = req.params;
  delete urlDatabase[id];
  res.redirect("/urls");
});
// Edit Url
app.post("/urls/:id/edit", (req, res) => {
  let { id } = req.params;
  let { session } = req.session.user_id
  let { longURL } = req.body;
  urlEdit(id, session, longURL, urlDatabase);
  res.redirect("/urls");
});
// Log out from the Website / Clears Session
app.post("/logout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/urls");
});
// Registers User, Hashes Password
app.post("/register", (req, res) => {
  let { email, password } = req.body;
  if (email === "" || password === "") {
    res.end("400 Error");
  } else if (findEmail(email, users)) {
    res.end("400 Error Email");
  } else if (!findEmail(email, users)) {
    let id = addNewUser(email, password, users);
    req.session.user_id = id;
    res.redirect("/urls");
  }
});
// Login Ins a registered User
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  let id = checkPassword(password, users);
  if (email === "" || password === "") {
    return "400 Error";
  } else if (findEmail(email, users)) {
    if (id) {
      req.session.user_id = id;
      res.redirect("/urls");
    } else {
      res.write("400 Error ");
    }
  } else if (!findEmail(email, users)) {
    res.end("403 Error");
  }
});
