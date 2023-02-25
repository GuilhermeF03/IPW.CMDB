import chai from 'chai'
import { expect } from 'chai'
import { errors } from '../errors/http-errors.mjs'
import fs from "node:fs/promises";
import path from "path";
import url from "url";
import chaiAsPromised from 'chai-as-promised'
import mem  from './data-mem/data-mem-revised.mjs'
import utils from './data-mem/data-mem-utils.mjs'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.join(__dirname,"..\\","data/dataTest.json");
chai.should()
chai.use(chaiAsPromised)

const mock_movies =
[
    {id:0, title : 'ABC', description : 'movie_desc_1', year: 2000, runtime: 143},
    {id:1,title : 'DEFAULT', description : 'movie_desc_2', year : 1990, runtime: 123},
    {id:2,title : 'MOV_3', description : 'movie_desc_3', year : 1980, runtime: 112}
]
const mock_group_1 = 
{
    name: 'group_1',
    description: 'group_desc_1',
    "total-duration": 155,
    movies : mock_movies
}
const mock_group_2 = 
{
    name: 'group_2',
    description: 'group_desc_2',
    "total-duration": 455,
    movies : mock_movies
}
const mock_user_1 = {token:1234, username:'mock_user', password:'xax', groups: []}
const mock_user_2 = {token:5678, username:'mock_user', password:'dadw', groups: []}
const mock_user_3 = {token:9101, username:'mock_user_2', password:'xax', groups: []}

console.log("MEMORY =============================");
describe('MEMORY', async () => 
{
    it('reset database', async() => 
    {
        await utils.clearData()
    })
    describe('MEMORY - USER', async () => 
    {
        it('create new user into empty database - should not fail', () => 
        {
            return mem.createUser(mock_user_1)
            .should.eventually.be.undefined
        })
        describe('REPEATED CREDENTIAL', () => 
        {
            it('add user with same username - should fail', () =>
            {
                return mem.createUser(mock_user_2)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST())
            })
            it('add user with same token - should fail', () =>
            {
                return mem.createUser(mock_user_1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST())
            })
            it('add new user - same password different username - should be ok ', () => 
            {
                return mem.createUser(mock_user_3)
                .should.eventually.be.undefined
            })
        })
    })

    describe('MEMORY - VALIDATION', () => 
    {
        it('validate invalid user', () => 
        {
            return mem.validateUser(mock_user_2.username,mock_user_2.password)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('validate valid user', () => 
        {
            return mem.validateUser(mock_user_1.username, mock_user_1.password)
            .should.eventually.be.an('object')
            .and.property('token')
        })
    })
    
    describe("MEMORY - GROUP", async () => 
    {
        describe("CREATE GROUP", () => 
        {
            it('add group to invalid user - should fail', () => 
            {
                return mem.createGroup(mock_user_2.token, mock_group_1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('add group to valid user - should not fail', () => 
            {
                return mem.createGroup(mock_user_3.token, mock_group_1)
                .should.eventually.be.an('object')
            })
        })
        describe("GET GROUP", () => 
        {
            it('get invalid group id from invalid user - should fail', ()=> 
            {
                return mem.getGroupById(mock_user_2.token, 0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('get invalid group id from valid user - should not fail', ()=> 
            {
                return mem.getGroupById(mock_user_3.token, -1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST())
            })
            it('get valid group id from valid user id', () => 
            {
                return mem.getGroupById(mock_user_3.token,0)
                .should.eventually.be.an('object')
                .and.property('total-duration')
            })
        })
        describe("UPDATE GROUP", () => 
        {
            it('update group from invalid user', () => 
            {
                return mem.updateGroup(mock_user_2.token, 0, mock_group_2)
                .should.eventually.be.rejected.and.deep.equal(errors.NOT_AUTHORIZED());
            })
            it('update invalid group', () => 
            {
                return mem.updateGroup(mock_user_3.token, -1, mock_group_2)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST());
            })
            it('update valid group', () => 
            {
                return mem.updateGroup(mock_user_3.token, 0, mock_group_2)
                .should.eventually.be.an('object')
                .and.property("description");
            })
        })
        describe("LIST GROUPS", () => 
        {
            it('list invalid user groups', () => 
            {
                return mem.listUserGroups(mock_user_2.token)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED());
            })
            it('list valid user groups', () => 
            {
                return mem.listUserGroups(mock_user_3.token)
                .should.eventually.have.property('groups');
            })
        })
        describe("REMOVE GROUP", () => 
        {
            it('remove group from invalid user', () => 
            {
                return mem.deleteGroup(mock_user_2.token,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED());
            })
            it('remove invalid group', () => 
            {
                return mem.deleteGroup(mock_user_3.token, -1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST());
            })
            it('remove valid group', () => 
            {
                return mem.deleteGroup(mock_user_3.token,0)
                .should.eventually.be.undefined;   
            })
        })
    })
    
    describe("MEMORY - MOVIES", async () => 
    {  
        it('-- preparing movie tests -- [SKIP THIS TEST] --', () => 
        {
            mem.createGroup(mock_user_1.token, mock_group_2)
        })
        describe('ADD MOVIE', () => 
        {
            it('add from inexistent user', () => 
            {
                return mem.addMovie(0, 0,mock_movies[0])
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('add from inexistent group', () => 
            {
                return mem.addMovie(mock_user_1.token,10,mock_movies[0])
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND());
            })
            it('add valid movie', () => 
            {
                return mem.addMovie(mock_user_1.token, 0 , mock_movies[0])
                .should.eventually.deep.equal(mock_movies[0]);
            })
        })
        describe('REMOVE MOVIE', () => 
        {
            it('remove from inexistent user', () => 
            {
                return mem.deleteMovie(0,0,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('remove from inexistent group', () => 
            {
                return mem.deleteMovie(mock_user_3.token, 10, 0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND());
            })
            it('remove inexistent movie', () => 
            {
                return mem.deleteMovie(mock_user_1.token, 0, -1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.BAD_REQUEST());
            })
            it('remove valid movie', () => 
            {
                return mem.deleteMovie(mock_user_1.token, 0, 0)
                .should.eventually.be.undefined;
            })
        })
    })
})

