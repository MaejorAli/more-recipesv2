import recipeController from '../controllers/recipes';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the more-recipes Api' });
  });

  app.post('/api/v1/recipes', recipeController.addRecipe);
  app.get('/api/v1/recipes', recipeController.getRecipes);
  app.delete('/api/v1/recipes/:recipeId', recipeController.removeRecipes);
  app.put('/api/v1/recipes/:recipeId', recipeController.updateRecipes);
  app.post('/api/v1/recipes/:recipeId/reviews', recipeController.addReview);
};

