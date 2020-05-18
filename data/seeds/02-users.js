
exports.seed = function (knex) {
  // 000-cleanup.js already cleaned out all tables

  const users = [
    {
      username: "user1",
      password: "password!",
      role: 2,
    },
    {
      username: "admin",
      password: "secret",
      role: 1,
    },
    {
      username: "me",
      password: "nopass",
      role: 2,
    }
  ];

  return knex("users").insert(users);
};
