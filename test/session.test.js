import chai from 'chai';
import supertest from 'supertest';

const  expect = chai.expect;
const request = supertest('http://localhost:3000');

describe('Testing Adoptme', () => {

    describe('Test Session', () => {
        const cookie = {
            name: null,
            value: null
        }
        const userMock = {
            first_name:"Maxi",
            last_name:"Rosanda",
            email:"maxi_rosanda5@hotmail.com",
            password:"123456"
        }
        it('Post /api/users crear un usuario', async () => {
           
            const {statusCode, ok, _body} = await request.post('/api/sessions/register').send(userMock);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(_body).to.have.property('status','success');
        })

        it('Post /api/sessions loguear un usuario', async () => {
   
            const {statusCode, ok, _body, headers} = await request.post('/api/sessions/login').send(userMock);

            const cookieResult = headers['set-cookie'][0];
            cookie.name = cookieResult.split('=')[0];
            cookie.value = cookieResult.split('=')[1].split(';')[0];

            expect(cookie.name).to.be.equal('coderCookie');
            expect(cookie.value).to.be.ok;
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(_body).to.have.property('status','success');

        })
        it("GET /api/sessions/current debe devolver el usuario logueado", async () => {
            const {statusCode, ok, _body} = await request.get('/api/sessions/current').set('Cookie',`${cookie.name}=${cookie.value}`);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(_body).to.have.property('status','success');
           expect(_body.payload).to.have.property('name','Maxi Rosanda');
        })

    })
    describe('Test de autenticación sin protección', () => {
        const cookie = {
            name: null,
            value: null
        };
        const mockUser = {
            first_name: "Mauricio",
            last_name: "Espinosa",
            email: "correomau@correo.com",
            password: "123"
        };
        it('Post /api/sessions/unprotectedlogin loguear un usuario', async () => {
   
            const {statusCode, ok, _body, headers} = await request.post('/api/sessions/unprotectedlogin').send(mockUser);
            const cookieResult = headers['set-cookie'][0];
            cookie.name = cookieResult.split('=')[0];
            cookie.value = cookieResult.split('=')[1].split(';')[0];
            expect(cookie.name).to.be.equal('unprotectedCookie');
            expect(cookie.value).to.be.ok;

         })
        it("GET /api/sessions/unprotectedcurrent debe devolver el usuario logueado", async () => {
            const {statusCode, ok, _body} = await request.get('/api/sessions/unprotectedcurrent').set('Cookie',`${cookie.name}=${cookie.value}`);
            expect(statusCode).to.be.equal(200);
            expect(ok).to.be.equal(true);
            expect(_body).to.have.property('status','success');
            expect(_body.payload).to.have.property('first_name','Mauricio');
            expect(_body.payload).to.have.property('last_name','Espinosa');
            expect(_body.payload).to.have.property('email','correomau@correo.com');

    })

})
})