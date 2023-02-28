import imdb from './imdb-revised.mjs'
import chai, { expect } from 'chai'
import { errors } from '../../errors/http-errors.mjs'
import chaiAsPromised from 'chai-as-promised'


chai.should()
chai.use(chaiAsPromised)

describe('IMDB============================================================', () =>
{
    it('get 250', function ()
    {
        this.timeout(10000)
        return imdb.getTop250()
        .should.eventually.be.an('object')
        .and.property('results');
    })
    describe('movie search', () =>
    {
        const names = ['avatar','avengers','Inception']
        names.forEach(name => 
        {
            it(`searching for ${name}`, function () 
            {
                this.timeout(10000)
                return imdb.searchMovieByName(name)
                .should.eventually.be.an('object')
                .and.have.property('results');
            })  
        });
    })
    describe('get movie by id', () => 
    {
        const ids = ["tt0468569","tt0167260","tt0110912"]
        ids.forEach( id => 
        {
            it(`getting movie with id ${id}`, function() 
            {
                this.timeout(10000)
                return imdb.getMovieById(id)
                .should.eventually.be.an('object')
                .and.have.property('id')
            } )
        })
    })
})