import request from 'supertest';
import chai from 'chai';
import app from '../app';


const { expect } = chai;

describe('test-cases for api routes', () => {
  describe('GET /', () => {
    it('responds with a 200 and welcome message in json', (done) => {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Welcome to the beginning of nothingness.' }, done);
    });
  });

  describe('GET /api', () => {
    it('responds with a 200 and welcome message in json', (done) => {
      request(app)
        .get('/api')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Welcome to the more-recipes Api' }, done);
    });
  });

  describe('POST /api/v1/recipes', () => {
    it('responds with the right reponse when a recipe is created', (done) => {
      const recipe = {
        recipeName: 'Spaked Rosillary Dessert',
        directions: 'It is a dessert',
        ingredients: 'water and water',
      };
      request(app)
        .post('/api/v1/recipes')
        .send(recipe)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          const { message } = res.body;
          const { recipeName } = res.body.response;
          expect(message).to.equal('Recipe Successfully saved and created');
          expect(recipeName).to.equal('Spaked Rosillary Dessert');
        });
    });

    describe('errors are properly handled when a request is made to create a recipe', () => {
      it('responds with the right reponse when some of the request body field is missing', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: 'It is a dessert',

        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Invalid Input');
          });
      });
      it('responds with the right reponse when some request body field is null', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: 'It is a dessert',
          ingredients: '',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('A field does not contain any input');
          });
      });
      it('responds with the right reponse when some request body field contains only whitespaces', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: '    ',
          ingredients: 'water and water',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('A field does not contain any input');
          });
      });
      it('responds with the right reponse when some request body field contains only digits', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: 'It is a dessert',
          ingredients: '234',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Only text can be inputed');
          });
      });
      it('responds with the right reponse when some request body field is alphanumeric', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          ingredients: '3greatchef',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Invalid Input');
          });
      });
    });
  });

  describe('GET /api/v1/recipes', () => {
    it('returns an array of objects of recipes', (done) => {
      request(app)
        .get('/api/v1/recipes')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });


  describe('DELETE /api/v1/recipes/<recipeId>', () => {
    it('deletes a recipe from the list of recipes in database', (done) => {
      request(app)
        .delete('/api/v1/recipes/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(res.body.message).to.equal('recipe successfully deleted');
        });
    });

    it('returns an error message when the recipe to delete is not in db', (done) => {
      request(app)
        .delete('/api/v1/recipes/0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done)
        .expect((res) => {
          const { message } = res.body;
          expect(message).to.equal('recipe you intended to delete does not exist');
        });
    });
  });
  describe('POST /api/v1/recipes/<recipeId>/reviews', () => {
    it('responds with the right response when it adds a review to a particular recipe', (done) => {
      const recipe = {
        recipeName: 'Spaked Rosillary Dessert',
        directions: 'It is a dessert',
        ingredients: 'water and water',
        reviews: 'simply delicious',
      };
      request(app)
        .post('/api/v1/recipes/2/reviews')
        .send(recipe)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          const { message } = res.body;
          expect(message).to.equal('Review successfully Posted');
        });
    });
  });
  describe('PUT /api/v1/recipes/<recipeId>', () => {
    it('responds with the right response when it updates a particular recipe', (done) => {
      const recipe = {
        recipeName: 'Spaked Rosillary Dessert',
        directions: 'It is a dessert',
        ingredients: 'water and water',
      };
      request(app)
        .put('/api/v1/recipes/2')
        .send(recipe)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          const { message } = res.body;
          expect(message).to.equal('Successfully Updated');
        });
    });
  });
  describe('GET /api/v1/recipes?sort=upvotes&order=des', () => {
    it('returns with the right response when getting sorted recipes', (done) => {
      request(app)
        .get('/api/v1/recipes?sort=upvotes&order=des')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  describe('GET /api/v1/recipes?sort=upvotes&order=asc', () => {
    it('returns with the right response when getting sorted recipes', (done) => {
      request(app)
        .get('/api/v1/recipes?sort=upvotes&order=asc')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
  describe('PUT /api/v1/recipes/<recipeId>', () => {
    describe('errors are properly handled when a request is made to update/modify a recipe', () => {
      it('responds with the right reponse when some request body field is null', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: 'It is a dessert',
          ingredients: '',
        };
        request(app)
          .put('/api/v1/recipes/1')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('A field does not contain any input');
          });
      });
      it('responds with the right reponse when some request body field contains only whitespaces', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: '    ',
          ingredients: 'water and water',
        };
        request(app)
          .put('/api/v1/recipes/1')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('A field does not contain any input');
          });
      });
      it('responds with the right reponse when some request body field contains only digits', (done) => {
        const recipe = {
          recipeName: 'Spaked Rosillary Dessert',
          directions: 'It is a dessert',
          ingredients: '234',
        };
        request(app)
          .put('/api/v1/recipes/1')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Only text can be inputed');
          });
      });
    });
  });
});
