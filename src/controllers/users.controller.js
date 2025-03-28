import { usersService } from "../services/index.js";
import { logger } from "../utils/logger.js";
import __dirname from "../utils/index.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAll();
    res.send({ status: "success", payload: users });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if (!user)
      return res.status(404).send({ status: "error", error: "User not found" });
    res.send({ status: "success", payload: user });
  } catch (error) {
    logger.error(error.message);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const addDocuments = async (req, res) => {
  const userId = req.params.uid;
  const files = req.files;
  const documents = files.map((file) => {
    return {
      name: file.originalname,
      reference: `${__dirname}/../public/img/${file.filename}`,
    };
  });
  console.log(documents);
  const result = await usersService.addDocuments(userId, documents);
  res.send({ status: "success", message: "Documents added" });
};

const updateUser = async (req, res) => {
  const updateBody = req.body;
  const userId = req.params.uid;
  const user = await usersService.getUserById(userId);
  if (!user)
    return res.status(404).send({ status: "error", error: "User not found" });
  const result = await usersService.update(userId, updateBody);
  res.send({ status: "success", message: "User updated" });
};

const deleteUser = async (req, res) => {
  const userId = req.params.uid;
  const result = await usersService.getUserById(userId);
  res.send({ status: "success", message: "User deleted" });
};

export default {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  addDocuments,
};
