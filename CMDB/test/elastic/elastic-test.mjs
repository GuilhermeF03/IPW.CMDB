
import elastic from './elastic-revised.mjs'
import chai from 'chai'
import { expect } from 'chai'
import { errors } from '../../errors/http-errors.mjs'
import chaiAsPromised from 'chai-as-promised'
import utils from './elastic-utils.mjs'
import { MemoryStore } from 'express-session'
chai.should()
chai.use(chaiAsPromised)

async function clearDatabase() 
{
    const indexes = ['users', 'groups', 'movies']
    indexes.forEach(async (index) => await utils.deleteAllEntries(index))
}

const baseURL = "http://localhost:9200/";

const mock_user_1 = {username:'user1', password:'xxx'}
const dup_username_1 = {username:'user1', password:'ddd'}
const mock_user_2 = {username:'user2', password:'xxx'}

const mock_group_1 = {name:'group1',description : 'desc_group1'}
const mock_group_2 = {name:'group2',description : 'desc_group2'}

const mock_movies =
[
    {id:0, title : 'ABC', description : 'movie_desc_1', year: 2000, runtime: 143},
    {id:1, title : 'DEFAULT', description : 'movie_desc_2', year : 1990, runtime: 123},
    {id:2, title : 'MOV_3', description : 'movie_desc_3', year : 1980, runtime: 112}
]
describe('ELASTIC =================', () => 
{
    it('reset database', async () => 
    {
        await clearDatabase()
    })

    describe('ELASTIC - CREATE USER', () => 
    {
        it('add empty user or duplicated password - should pass', () => 
        {
            return (elastic.createUser(mock_user_1)
            .then(data => 
            {
                mock_user_1.token = data._id
                return data
            })
            .should.eventually.be.an('object')
            .and.property('_index').equal('users')
            &&
            elastic.createUser(mock_user_2)
            .then(data => 
            {
                mock_user_2.token = data._id
                return data
            })
            .should.eventually.be.an('object')
            .and.property('_index').equal('users'));
        })
        it('add duplicated username - should fail', () => 
        {
            return elastic.createUser(dup_username_1)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
        })
    })

    describe('ELASTIC - VALIDATION', () => 
    {
        it('validate invalid user', () => 
        {
            return elastic.validateUser(dup_username_1.username,dup_username_1.password)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('validate valid user', () => 
        {
            return elastic.validateUser(mock_user_1.username,mock_user_1.password)
            .should.eventually.be.an('object')
            .and.have.property('token')
        })
    })

    describe('ELASTIC - GROUPS', () => 
    {
        describe('ELASTIC - CREATE GROUP', () => 
        {
            it('create group to invalid user', () => 
            {
                return elastic.createGroup(1234, mock_group_1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('create group to valid user', () =>  
            {
                return elastic.createGroup(mock_user_1.token, mock_group_1)
                .then(data => 
                    {
                        mock_group_1.id = data.id;
                        return data
                    })
                .should.eventually.be.an('object')
                .and.property('id')
            })
        })
        describe('ELASTIC - GET GROUP', () => 
        {
            it('get invalid / valid group from invalid user', () => 
            {
                return (elastic.getGroupById(1234, 0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
                &&
                elastic.getGroupById(1234,mock_group_1.id)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED()))
            })
            it('get invalid group from valid user', () => 
            {
                return elastic.getGroupById(mock_user_1.token,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND())
            })
            it('get valid group from valid user', () => 
            {
                return elastic.getGroupById(mock_user_1.token, mock_group_1.id)
                .should.eventually.be.an('object')
                .and.property('number of movies')
            })
        })
        describe('ELASTIC - UPDATE GROUP', () => 
        {
            it('update invalid / valid group from invalid user', () =>
            {
                return (elastic.updateGroup(1234, 0, mock_group_2)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
                &&
                elastic.updateGroup(1234, mock_group_1.id, mock_group_2)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED()))
            })
            it('update invalid group from valid user',() => 
            {
                return elastic.updateGroup(mock_user_1.token, 0, mock_group_2)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND())
            })
            it('update valid group from valid user', () => 
            {
                return elastic.updateGroup(mock_user_1.token, mock_group_1.id, mock_group_2)
                .should.eventually.be.an('object')
                .and.property('status').deep.equal('updated')
            })
        })
        describe('ELASTIC - LIST GROUPS' , () => 
        {
            it('list groups of invalid user' ,() => 
            {
                return elastic.listUserGroups(1234)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('list groups from valid user', () => 
            {
                return elastic.listUserGroups(mock_user_1.token)
                .should.eventually.be.an('array')
                .and.length(1)
            })
        })
        describe('ELASTIC - REMOVE GROUP', () => 
        {
            it('remove invalid / valid group form invalid user', () => 
            {
                return (elastic.deleteGroup(1234,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
                &&
                elastic.deleteGroup(1234, mock_group_1.id)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED()))
            })
            it('remove invalid group form valid user', () => 
            {
                return elastic.deleteGroup(mock_user_1.token,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND())
            })
            it('remove valid group from valid user', () => 
            {
                return elastic.deleteGroup(mock_user_1.token, mock_group_1.id)
                .should.eventually.be.an('object')
                .and.property('status').equal('deleted')
            })
        })
    })
})
describe('ELASTIC - MOVIES', () => 
{
    it('-- preparing movies tests -- [SKIP THIS TEST ] --', async () => 
    {
        return elastic.createGroup(mock_user_1.token, mock_group_2)
        .then(data => 
        {
            mock_group_2.id = data.id
        })
    })
    describe('ADD MOVIE', () => 
        {
            it('add from inexistent user', () => 
            {
                return elastic.addMovie(dup_username_1.token, mock_group_2.id, mock_movies[0])
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('add from inexistent group', () => 
            {
                return elastic.addMovie(mock_user_1.token,10,mock_movies[0])
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND());
            })
            it('add valid movie', async() => 
            {
                return elastic.addMovie(mock_user_1.token, mock_group_2.id, mock_movies[0])
                .then(data => 
                {
                    mock_movies[0].id = data.id
                    return data
                })
                .should.eventually.be.an('object')
                .and.property('title').equal(mock_movies[0].title);
            })
        })
        describe('REMOVE MOVIE', () => 
        {
            it('remove from inexistent user', () => 
            {
                return elastic.deleteMovie(dup_username_1.token,mock_group_2.id,0)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_AUTHORIZED())
            })
            it('remove from inexistent group', () => 
            {
                return elastic.deleteMovie(mock_user_1.token, 10, 0)
                .should.eventually.be.rejected
                .and.property('code').deep.equal(errors.NOT_FOUND().code);
            })
            it('remove inexistent movie', () => 
            {
                return elastic.deleteMovie(mock_user_1.token, mock_group_2.id, 1)
                .should.eventually.be.rejected
                .and.deep.equal(errors.NOT_FOUND())
            })
            it('remove valid movie', () => 
            {
                return elastic.deleteMovie(mock_user_1.token, mock_group_2.id, mock_movies[0].id)
                .should.eventually.be.an('object');
            })
        })
})