// EJS Intergration
const express = require("express");
const app = express(); // Express Framework
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bcrypt = require("bcrypt");
const functions = require("./functions");
const {
  findEmail,
  generateRandomString,
  addNewUser,
  checkPassword,
  filterUrls
} = require("./functions");

app.use(morgan(":method :url :response-time"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

// const urlDatabase = {
//   b2xVn2: "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get("/urls/new", (req, res) => {
  userId = req.cookies["user_id"] ? req.cookies["user_id"] : "";
  let templateVars = { urls: urlDatabase, user: users[userId] };
  if (req.cookies["user_id"]) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  userId = req.cookies["user_id"] ? req.cookies["user_id"] : "";
  let filteredData = filterUrls(userId, urlDatabase);
  let templateVars = {
    user: users[userId],
    urls: filteredData
  };

  res.render("urls_index", templateVars);
});
app.get("/urls/:shortURL", (req, res) => {
  userId = req.cookies["user_id"] ? req.cookies["user_id"] : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

app.get("/register", (req, res) => {
  userId = req.cookies["user_id"] ? req.cookies["user_id"] : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_register", templateVars);
});

app.get("/login", (req, res) => {
  userId = req.cookies["user_id"] ? req.cookies["user_id"] : "";
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[userId]
  };
  res.render("urls_login", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  // console.log(urlDatabase);
  //
  // res.send("Redirection in progres.."); // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  let { id } = req.params;
  delete urlDatabase[id];
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
  let { id } = req.params;
  urlDatabase[id] = req.body.longURL;
  res.redirect("/urls");
});

// app.post("/login", (req, res) => {
//   res.cookie("username", req.body.username);
//   res.redirect("/urls");
// });

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let { email, password } = req.body;
  if (email === "" || password === "") {
    res.end("400 Error");
  } else if (findEmail(email, users)) {
    // Add email/password to the ID Object
    res.end("400 Error Email");
  } else if (!findEmail(email, users)) {
    let id = addNewUser(email, password, users);
    console.log("Users:", users);
    res.cookie("user_id", id);
    res.redirect("/urls");
  }
});

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  let id = checkPassword(password, users)
  if (email === "" || password === "") {
    return "400 Error";
  } else if (findEmail(email, users)) {
    if (id) {
      // let id = addNewUser(email, password, users);
      res.cookie("user_id", id);
      res.redirect("/urls");
    } else {
      res.end("400 Error ");
    }
  } else if (!findEmail(email, users)) {
    res.write("403 Error");
  }
});
