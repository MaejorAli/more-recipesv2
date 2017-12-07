import request from 'supertest';
import { expect } from 'chai';
import app from '../app';

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
        name: 'Spaked Rosillary Dessert',
        description: 'It is a dessert',
        category: 'Dessert',
        ingredients: 'water and water',
        creator: 'Efosa Okpugie',
      };
      request(app)
        .post('/api/v1/recipes')
        .send(recipe)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201, done)
        .expect((res) => {
          const { message } = res.body;
          const { name } = res.body.response;
          expect(message).to.equal('Recipe Successfully saved and created');
          expect(name).to.equal('Spaked Rosillary Dessert');
        });
    });

    describe('errors are properly handled when a request is made to create a recipe', () => {
      it('responds with the right reponse when some of the request body field is missing', (done) => {
        const recipe = {
          name: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          category: 'Dessert',
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
            if (res.body.name !== undefined) {
              throw new Error('Invalid response');
            }
            expect(error).to.equal('Please fill in all fields');
          });
      });
      it('responds with the right reponse when some request body field is null', (done) => {
        const recipe = {
          name: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          category: 'Dessert',
          ingredients: 'water and water',
          creator: '',
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
          name: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          category: 'Dessert',
          ingredients: 'water and water',
          creator: '      ',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal('Your input should not contain only white-spaces');
          });
      });
      it('responds with the right reponse when some request body field contains only digits', (done) => {
        const recipe = {
          name: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          category: 'Dessert',
          ingredients: 'water and water',
          creator: '234',
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
          name: 'Spaked Rosillary Dessert',
          description: 'It is a dessert',
          category: 'Dessert',
          ingredients: 'water and water',
          creator: '3greatchef',
        };
        request(app)
          .post('/api/v1/recipes')
          .send(recipe)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201, done)
          .expect((res) => {
            const { error } = res.body;
            expect(error).to.equal(undefined);
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
        .expect(200, done)
        .expect((res) => {
          expect(typeof res.body[0].name).to.equal('string');
          expect(res.body[0].name).to.equal('Spaked Rosillary Dessert');
          expect(res.body.length).to.equal(2);
        });
    });
  });

  describe('GET /api/v1/recipes/<recipeId>', () => {
    it('returns just one particular recipe', (done) => {
      request(app)
        .get('/api/v1/recipes/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(typeof res.body.oneRecipe.name).to.equal('string');
          expect(res.body.oneRecipe.name).to.equal('Spaked Rosillary Dessert');
        });
    });
    it('returns an error message when the passed recipe is not in db', (done) => {
      request(app)
        .get('/api/v1/recipes/3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
          const { error } = res.body;
          expect(error).to.equal('recipe you intended to find cannot be found');
        });
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
    it('updates the list of recipes in the database upon delete', (done) => {
      request(app)
        .get('/api/v1/recipes')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          expect(res.body.length).to.equal(1);
          expect(res.body[0].creator).to.equal('3greatchef');
        });
    });
    it('returns an error message when the recipe to delete is not in db', (done) => {
      request(app)
        .delete('/api/v1/recipes/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
          const { error } = res.body;
          expect(error).to.equal('recipe you intended to delete does not exist');
        });
    });
  });

  describe('POST /api/v1/recipes/<recipeId>/upvote', () => {
  	it('can upvote a recipe', (done) => {
      request(app)
        .post('/api/v1/recipes/2/upvote')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          const { message } = res.body;
          expect(message).to.equal('Success, You have successfully upvoted the recipe');
        });
    });
    it('responds with an error message if the recipe to upvote is not in db', (done) => {
      request(app)
        .post('/api/v1/recipes/1/upvote')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
          const { error } = res.body;
          expect(error).to.equal('The recipe you intended to upvote cannot be found');
        });
    });
    it('updates the count of upvotes on a recipe on upvoting', (done) => {
      request(app)
        .get('/api/v1/recipes')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          const { upvotes } = res.body[0];
          expect(upvotes).to.equal(1);
        });
    });
  });

  describe('POST /api/v1/recipes/<recipeId>/downvote', () => {
  	it('can downvote a recipe', (done) => {
      request(app)
        .post('/api/v1/recipes/2/downvote')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          const { message } = res.body;
          expect(message).to.equal('Success, You have successfully downvoted the recipe');
        });
    });
    it('responds with an error message if the recipe to downvote is not in db', (done) => {
      request(app)
        .post('/api/v1/recipes/1/downvote')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
          const { error } = res.body;
          expect(error).to.equal('The recipe you intended to downvote cannot be found');
        });
    });
    it('updates the count of downvotes on a recipe on downvoting', (done) => {
      request(app)
        .get('/api/v1/recipes/')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          const { downvotes } = res.body[0];
          expect(downvotes).to.equal(1);
        });
    });
  });

  describe('POST /api/v1/users/signup', () => {
    let tokenGenerated;
    it('creates a new user if all user input is met', (done) => {
      const userInputs = {
        firstname: 'Efosa',
        lastname: 'Okpugie',
        username: 'efosky',
        email: 'efosaokpugie@gmail.com',
        password: 'swampious',
        confirmpassword: 'swampious',
      };
      request(app)
        .post('/api/v1/users/signup')
        .send(userInputs)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res) => {
          console.log(res.body);
          expect(res.body.message).to.equal('You have successfully signed up');
          expect(res.body.firstname).to.equal(userInputs.firstname);
          expect(res.body.lastname).to.equal(userInputs.lastname);
          expect(res.body.email).to.equal(userInputs.email);
        });
    });
  });
});
