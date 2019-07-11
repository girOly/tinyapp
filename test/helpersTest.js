const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

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

describe("getUserByEmail", function() {
  it("should return a user with valid email", function() {
    const user = getUserByEmail("user@example.com", users);
    const expectedOutput = "userRandomID";
    assert.deepEqual(user, expectedOutput);
  });
  it("should return undefined with an invalid email", function() {
    const user = getUserByEmail("thiswontwork@example.com", users);
    const expectedOutput = undefined;
    assert.deepEqual(user, expectedOutput);
  });
});
git
