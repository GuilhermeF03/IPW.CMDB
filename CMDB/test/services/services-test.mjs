import { errors } from '../../errors/http-errors.mjs'
import getServices from './services-mock.mjs'
import mem from '../data-mem/data-mem-revised.mjs'
import memUtils from '../data-mem/data-mem-utils.mjs'
import elastic from '../elastic/elastic-revised.mjs'
import elasticUtils from '../elastic/elastic-utils.mjs'
import data from '../imdb/imdb-revised.mjs'
import chai from 'chai'
import { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.should()
chai.use(chaiAsPromised)
const services = getServices(data, elastic)

let mock_user_1 = {username:'services_test', password:'xxx'}

const group_no_description = {name:'group1'}
let mock_group = {name:'group2', description : 'desc_group2'}

const mock_movies =
[
    {id:0, title : 'ABC', description : 'movie_desc_1', year: 2000, runtime: 143},
    {id:1, title : 'DEFAULT', description : 'movie_desc_2', year : 1990, runtime: 123},
    {id:2, title : 'MOV_3', description : 'movie_desc_3', year : 1980, runtime: 112}
]

const mock_movie_id = "tt0468569"
//await services.addMovie("b0535647-9532-4699-b0de-cc4152739ee4",0, mock_movie_id)

describe('SERVICES================================', () => 
{
    // describe('SERVICES - GET POPULAR MOVIES', () => 
    // {
    //     it('invalid max parameter format or number', function() 
    //     {
    //         this.timeout(10000)
    //         return (services.getPopularMovies('abc')
    //         .should.eventually.be.rejected
    //         .and.deep.equal(errors.BAD_REQUEST())
    //         &&
    //         services.getPopularMovies(-1)
    //         .should.eventually.be.rejected
    //         .and.deep.equal(errors.BAD_REQUEST()))
    //     })
    //     it('valid number', () => 
    //     {
    //         return services.getPopularMovies(15)
    //         .should.eventually.be.an('object')
    //         .and.property('results')
    //     })
    // })
    // describe('SEARCH MOVIE', () => 
    // {
    //     it('invalid parameters', function() 
    //     {
    //         this.timeout(10000)
    //         return (services.searchMovie(15,2)
    //         .should.eventually.be.rejected
    //         .and.deep.equal(errors.BAD_REQUEST())
    //         &&
    //         services.searchMovie('abc',-1)
    //         .should.eventually.be.rejected
    //         .and.deep.equal(errors.BAD_REQUEST()))
    //     })
    //     it('valid string and max parameter', function()
    //     {
    //         this.timeout(10000)
    //         return services.searchMovie('abc',2)
    //         .should.eventually.be.an('object')
    //         .and.property('results')
    //     })
    // })
    describe('CREATE USER', () => 
    {
        it('invalid username', () => 
        {
            return services.createUser({username:123, password:'abc'})
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
        })
        it('invalid password', () => 
        {
            return services.createUser({username:'abc', password:123})
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
        })
        it('valid credentials', () => 
        {
            return services.createUser(mock_user_1)
            .then(data => 
                {
                    mock_user_1 = data;
                    return data
                })
            .should.eventually.be.an('object')
            .and.property('token')
        })
    })
    describe('VALIDATE USER', () => 
    {
        it('validate invalid credential format', () => 
        {
            return (services.validateUser(3)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
            &&
            services.validateUser('tobias',3)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST()))
        })
        it('validate invalid credentials', () => 
        {
            return services.validateUser('tobias', 'tobias')
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('validate valid credentials', () => 
        {
            return services.validateUser(mock_user_1.username, mock_user_1.password)
            .should.eventually.be.an('object')
            .and.property('token')
        })
    })
    describe('CREATE GROUP', () => 
    {
        it('invalid user token' ,() => 
        {
            return services.createGroup(0,mock_group)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('invalid groupInfo', () => 
        {
            return services.createGroup(mock_user_1.token, group_no_description)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
        })
        it('valid userToken and groupInfo', () => 
        {
            return services.createGroup(mock_user_1.token, mock_group)
            .then(data => 
                {
                    mock_group = data
                    return data
                })
            .should.eventually.be.an('object')
            .and.keys('id','name','description')
            .and.property('name').equal(mock_group.name)
        })
    })
    describe('GET GROUP BY ID', () => 
    {
        it('invalid token', () => 
        {
            return services.getGroupById(1,0)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED());
        })
        it('invalid group id', () => 
        {
            return services.getGroupById(mock_user_1.token, 10)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND());
        })
        it('valid token and id', () => 
        {
            return services.getGroupById(mock_user_1.token,mock_group.id)
            .should.eventually.be.an('object')
            .and.have.property('name')
        })
    })
    describe('UPDATE GROUP' ,() => 
    {
        it('invalid token', () => 
        {
            return services.updateGroup(0, 0,{name :'abc', description: 'def'})
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED());
        })
        it('invalid group id', () => 
        {
            return services.updateGroup(mock_user_1.token, 10,{name :'abc', description: 'def'})
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND());
        })
        it('invalid group info', () => 
        {
            return services.updateGroup(mock_user_1.token,mock_group.id, 0)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
        }) 
        it('valid information', () => 
        {
            return services.updateGroup(mock_user_1.token,mock_group.id, {name  :'abc', description: 'def'})
            .should.eventually.be.an('object')
            .and.have.property('name')
        })
    })
    describe('LIST USER GROUPS',() =>
    {
        it('invalid token', () => 
        {
            return services.listUserGroups(0)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED());
        })
        it('valid token', () => 
        {
            return services.listUserGroups(mock_user_1.token)
            .should.eventually.be.an('array')
        })
    })
    describe('ADD MOVIE', () => 
    {
        it('invalid token', function() 
        {
            this.timeout(10000)
            return services.addMovie('plki', 0, mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED());
        })
        it('invalid group id', function () 
        {
            this.timeout(10000)
            return services.addMovie(mock_user_1.token,10, mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND());
        })
        it('invalid movie id', function () 
        {
            this.timeout(10000)
            return services.addMovie(mock_user_1.token,mock_group.id,'ada')
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND())
        })
        it('valid information', function() 
        {
            this.timeout(10000)
            return services.addMovie(mock_user_1.token,mock_group.id, mock_movie_id)
            .should.eventually.be.an('object')
            .and.have.property('movieId').equal("tt0468569")
        })
        it('re-add movie in same group - should only search in memory and fail', function() 
        {
            this.timeout(10000)
            return services.addMovie(mock_user_1.token,mock_group.id, mock_movie_id)
            .should.eventually.be.rejected
            .and.property('code').deep.equal(errors.BAD_REQUEST().code)
        })
    })
    describe ('GET MOVIE BY ID' , () => 
    {
        it('invalid token', () => 
        {
            return services.getMovieById(0,0,mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED());
        })
        it('invalid group id', () => 
        {
            return services.getMovieById(mock_user_1.token,10,mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND());
        })
        it('invalid movie id', () => 
        {
            return services.getMovieById(mock_user_1.token,mock_group.id,'ada')
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND());
        })
        it('valid info', () => 
        {
            return services.getMovieById(mock_user_1.token, mock_group.id, mock_movie_id)
            .should.eventually.be.an('object')
            .and.property('movieId').deep.equal(mock_movie_id)
        })
    })
    describe('DELETE MOVIE', () => 
    {
        it('invalid token', () => 
        {
            return services.deleteMovie(0,0,mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('invalid group id', () => 
        {
            return services.deleteMovie(mock_user_1.token,10,mock_movie_id)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND())
        })
        it('invalid movie id', () => 
        {
            return services.deleteMovie(mock_user_1.token,mock_group.id,'adada')
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND())
        })
        it('valid info', () => 
        {
            return services.deleteMovie(mock_user_1.token,mock_group.id,mock_movie_id)
            .should.eventually.be.undefined
        })
    })
    describe('DELETE GROUP', () => 
    {
        it('invalid token', () => 
        {
            return services.deleteGroup(0,0)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('invalid group id', () => 
        {
            return services.deleteGroup(mock_user_1.token,70)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_FOUND())
        })
        it('valid info', () => 
        {
            return services.deleteGroup(mock_user_1.token, mock_group.id)
            .should.eventually.be.undefined
        })
    })
    describe('reset database', () => 
    {
        it('reset database' , async() => 
        {
            await elasticUtils.clearDatabase()
            await memUtils.clearData()
        })
    })
})