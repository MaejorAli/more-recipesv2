import Recipe from '../controllers/recipes';

const recipeController = new Recipe();
export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the more-recipes Api' });
  });

  app.post('/api/addrecipes', recipeController.addRecipe);
};



