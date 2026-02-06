// Each todo belongs to a user via userId (username). Legacy todos have userId: null and are not returned to any user.
let todos = [
  { message: "wash car", id: 1, userId: null },
  { message: "play tennis", id: 2, userId: null },
  { message: "make project", id: 3, userId: null },
];

let users = [];

module.exports = { todos,users };   