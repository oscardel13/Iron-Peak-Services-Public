const {
  getUser,
  getMyUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../../models/user/user.data");
const { getPagination } = require("../../utils/query");

async function httpGetUsers(req, res) {
  const { skip, limit } = getPagination(req.query);
  try {
    const users = await getUsers(skip, limit);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function httpGetUser(req, res) {
  const userId = req.params.id;
  try {
    let user = await getUser(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function httpGetMyUser(req, res) {
  const SessionUser = req.user;
  try {
    let user = await getMyUser(SessionUser._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

/* 
TODO:
1. make sure params.id = session.user.id
*/
async function httpUpdateUser(req, res) {
  const sessionUser = req.user;
  console.log("sessionUser", sessionUser);
  console.log("req.body", req.body);
  if (req.body._id !== sessionUser._id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const user = await updateUser(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function httpDeleteUser(req, res) {
  const sessionUser = req.user;
  if (req.body._id !== sessionUser._id) {
    return res.status(401).json({ message: "Not authorized" });
  }
  try {
    const user = await deleteUser(sessionUser._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function httpCheckIfAdmin(req, res) {
  res.status(200).send(true);
}

module.exports = {
  httpGetUsers,
  httpGetUser,
  httpGetMyUser,
  httpUpdateUser,
  httpDeleteUser,
  httpCheckIfAdmin,
};
