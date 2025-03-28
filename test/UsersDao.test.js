import Users from "../src/dao/Users.dao.js";
import mongoose from "mongoose";
import assert from "assert";

mongoose.connect("mongodb+srv://maxirosanda:zeBUkeQJiiw9WYEI@cluster0.wh168.mongodb.net/adoptme?retryWrites=true&w=majority&appName=Cluster0n")

describe("Users DAO", () => {
    before(function(){
        this.usersDao = new Users();
    })
    beforeEach(function(){
        mongoose.connection.collections.users.drop()
        this.timeout(5000)
    })

    it("El Dao debe poder obtener los usuarios en formato de arreglo",async function(){
        const result = await this.usersDao.get();
        assert.strictEqual(Array.isArray(result),true);

    })
    it("El Dao debe agregar correctamente un elemento a la base de datos",async function(){
        const user = {
            first_name: "Maxi",
            last_name: "Rosanda",
            email: "maxi_rosanda@hotmail.com",
            password:"123456"
        }
        const result = await this.usersDao.save(user);
        assert.strictEqual(result.first_name,user.first_name);

    })
    it("Al agregar un nuevo usuario, éste debe crearse con un arreglo de mascotas vacío por defecto",async function(){
        const user = {
            first_name: "Maxi",
            last_name: "Rosanda",
            email: "maxi_rosanda@hotmail.com",
            password:"123456"
        }
        const result = await this.usersDao.save(user);
        assert.deepStrictEqual(result.pets,[]);
    })
    it("El Dao puede obtener a un usuario por email",async function(){
        const user = {
            first_name: "Maxi",
            last_name: "Rosanda",
            email: "maxi_rosanda@hotmail.com",
            password:"123456"
        }
        const userCreated = await this.usersDao.save(user);
        const userFound = await this.usersDao.getBy({email:userCreated.email});
        assert.strictEqual(userFound.email,userCreated.email);
    })
       

})