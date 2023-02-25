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
const services = getServices(data,mem)

const mock_user_1 = {username:'services_test', password:'xxx'}
const dup_username_1 = {username:'user1', password:'ddd'}
const mock_group_1 = {name:'group1',description : 'desc_group1'}
const mock_group_2 = {name:'group2',description : 'desc_group2'}

const mock_movies =
[
    {id:0, title : 'ABC', description : 'movie_desc_1', year: 2000, runtime: 143},
    {id:1, title : 'DEFAULT', description : 'movie_desc_2', year : 1990, runtime: 123},
    {id:2, title : 'MOV_3', description : 'movie_desc_3', year : 1980, runtime: 112}
]



describe('SERVICES================================', () => 
{
    it('reset database' ,() => 
    {
        memUtils.clearData()
    })
    describe('SERVICES - GET POPULAR MOVIES', () => 
    {
        it('invalid max parameter format or number', () =>
        {
            return (services.getPopularMovies('abc')
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
            &&
            services.getPopularMovies(-1)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST()))
        })
        it('valid number', () => 
        {
            return services.getPopularMovies(15)
            .should.eventually.be.an('object')
            .and.property('results')
        })
    })
    describe('SEARCH MOVIE', () => 
    {
        it('invalid parameters', () => 
        {
            return (services.searchMovie(15,2)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST())
            &&
            services.searchMovie('abc',-1)
            .should.eventually.be.rejected
            .and.deep.equal(errors.BAD_REQUEST()))
        })
        it('valid string and max parameter', function()
        {
            this.timeout(10000)
            return services.searchMovie('abc',2)
            .should.eventually.be.an('object')
            .and.property('results')
        })
    })
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
            .should.eventually.be.an('object')
            .and.property('token')
        })
    })
    describe('VALIDATE USER', () => 
    {
        it('validate invalid credentials', () => 
        {
            return (services.validateUser({username: 3})
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
            &&
            services.validateUser({password: 3})
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED()))
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
            return services.createGroup(0,mock_group_1)
            .should.eventually.be.rejected
            .and.deep.equal(errors.NOT_AUTHORIZED())
        })
        it('invalid groupInfo', () => 
        {
            return services.createGroup(mock_user_1.token,mock_group_)
        })
    })
    // describe('GET GROUP BY ID')
    // describe('UPDATE GROUP')
    // describe('LIST USER GROUPS')
    // describe('DELETE GROUP')

    describe('GET MOVIE BY ID', () => 
    {
        // it('all invalid arguments', () => 
        // {
            //     return services.getMovieById(mock_user_1.token)
            // })
    })
        // describe('ADD MOVIE')
        // describe('DELETE MOVIE')
})