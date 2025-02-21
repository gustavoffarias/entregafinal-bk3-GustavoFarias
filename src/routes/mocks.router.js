import { Router } from "express";
import { faker } from "@faker-js/faker";
import { generateUser, generatePet } from '../utils/utils.js';
import petModel from '../dao/models/Pet.js'
import userModel from '../dao/models/User.js'

const router = Router();

router.get("/mockingpets", (req, res) => {
  const pets = [];
  const speciesList = ["dog", "cat", "fish"];

  for (let i = 0; i < 100; i++) {
    pets.push({
      name: faker.person.firstName(),
      specie: faker.helpers.arrayElement(speciesList),
      birthDate: faker.date
        .birthdate({ min: 1, max: 15, mode: "age" })
        .toISOString()
        .split("T")[0],
    });
  }
  res.send({ status: "success", payload: pets });
});

router.get("/mockingusers", async (req, res) => {
  const quantity = parseInt(req.query.quantity, 10) || 50;

  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({
      status: "error",
      message: "El parámetro quantity debe ser un número positivo.",
    });
  }

  const users = Array.from({ length: quantity }, generateUser);
  res.json({ status: "success", payload: users });
});

router.post("/generateData", async (req, res, next) => {
  const { users, pets } = req.body;

  if (typeof users !== "number" || typeof pets !== "number") {
    return next({ key: "INVALID_INPUT" });
  }

  if (users <= 0 || pets <= 0) {
    return next({
      key: "INVALID_INPUT",
      message: "Los valores de users y pets deben ser mayores que 0.",
    });
  }

  try {
    const generatedUsers = Array.from({ length: users }, generateUser);
    const generatedPets = Array.from({ length: pets }, generatePet);

    await userModel.insertMany(generatedUsers);
    await petModel.insertMany(generatedPets);

    res.json({
      status: "success",
      message: "Datos generados correctamente",
    });
  } catch (error) {
    next({ key: "SERVER_ERROR", message: error.message });
  }
});

export default router;
