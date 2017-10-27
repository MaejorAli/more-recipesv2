import recipeController from '../controllers/recipes';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the more-recipes Api' });
  });

  app.post('/api/recipes', recipeController.addRecipe);
  app.get('/api/recipes', recipeController.getRecipes);
  app.delete('/api/recipes/:recipeDbid', recipeController.removeRecipes);
  app.put('/api/recipes/:recipeDbid', recipeController.updateRecipes);
};



