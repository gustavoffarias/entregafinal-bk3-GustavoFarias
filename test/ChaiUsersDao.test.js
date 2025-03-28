import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import { expect } from "chai";

mongoose.connect(
  "mongodb+srv://maxirosanda:zeBUkeQJiiw9WYEI@cluster0.wh168.mongodb.net/adoptme?retryWrites=true&w=majority&appName=Cluster0n"
);

describe("Users DAO", () => {
  before(function () {
    this.usersDao = new Users();
  });
  beforeEach(function () {
    mongoose.connection.collections.users.drop();
    this.timeout(5000);
  });

  it("El Dao debe poder obtener los usuarios en formato de arreglo", async function () {
    const result = await this.usersDao.get();
    expect(result).to.be.an("array");
  });
  it("El Dao debe agregar correctamente un elemento a la base de datos", async function () {
    const user = {
      first_name: "Maxi",
      last_name: "Rosanda",
      email: "maxi_rosanda@hotmail.com",
      password: "123456",
    };
    const result = await this.usersDao.save(user);
    expect(result).to.have.property("first_name");
    expect(result.first_name).to.equal(user.first_name);
  });
  it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto", async function () {
    const user = {
      first_name: "Maxi",
      last_name: "Rosanda",
      email: "maxi_rosanda@hotmail.com",
      password: "123456",
    };
    const result = await this.usersDao.save(user);
    expect(result).to.have.property("pets");
    expect(result.pets).to.be.deep.equal([]);
  });
  it("El Dao puede obtener a un usuario por email", async function () {
    const user = {
      first_name: "Maxi",
      last_name: "Rosanda",
      email: "maxi_rosanda@hotmail.com",
      password: "123456",
    };
    const userCreated = await this.usersDao.save(user);
    const userFound = await this.usersDao.getBy({ email: userCreated.email });
    expect(userFound).to.have.property("email");
    expect(userFound.email).to.be.equal(userCreated.email);
  });

  it("El Dao debe actualizar correctamente un elemento en la base de datos", async function () {
    const user = {
      first_name: "Maxi",
      last_name: "Rosanda",
      email: "maxi_rosanda@hotmail.com",
      password: "123",
    };
    const userCreated = await this.usersDao.save(user);
    const updatedData = { first_name: "Mario" };
    const userUpdated = await this.usersDao.update(
      userCreated._id,
      updatedData
    );

    expect(userUpdated.first_name).to.be.equal(updatedData.first_name);
  });

  it("El Dao debe eliminar correctamente un elemento en la base de datos", async function () {
    const user = {
      first_name: "Maxi",
      last_name: "Rosanda",
      email: "maxi_rosanda@hotmail.com",
      password: "123",
    };
    const userCreated = await this.usersDao.save(user);
    await this.usersDao.delete(userCreated._id);
    const userFound = await this.usersDao.getBy({ email: userCreated.email });
    expect(userFound).to.be.equal(null);
  });
});
