import {expect} from 'chai';

import data from '../cmdb-data-mem.mjs'
import mem from '../cmdb-movies-data.mjs'
import servicesInit from '../cmdb-services.mjs'

describe('Services Tests', () => {
    
    it('get 3 top movies', () => {
        const getPopular = servicesInit(data);
        return getPopular.getPopularMovies(3)
                 .then(getMovies => expect(getMovies).
                        deep.equal({
                            "id": "tt0111161",
                            "rank": "1",
                            "title": "The Shawshank Redemption",
                            "year": "1994",
                            "imDbRating": "9.2",
                          },
                          {
                            "id": "tt0068646",
                            "rank": "2",
                            "title": "The Godfather",
                            "year": "1972",
                            "imDbRating": "9.2",
                          },
                          {
                            "id": "tt0468569",
                            "rank": "3",
                            "title": "The Dark Knight",
                            "year": "2008",
                            "imDbRating": "9.0",
                          }))
    });
    it('get the movie by the title <The Good, the Bad and the Ugly>')
});

