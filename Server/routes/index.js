import recipeController from '../controllers/recipes';
import errorHandler from '../middlewares/errors';


export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the more-recipes Api' });
  });

  app.post('/api/v1/recipes', errorHandler.checkNullInput, recipeController.addRecipe);
  app.get('/api/v1/recipes', recipeController.getRecipes);
  app.delete('/api/v1/recipes/:recipeId', recipeController.removeRecipes);
  app.put('/api/v1/recipes/:recipeId', errorHandler.checkInvalidModification, recipeController.updateRecipes);
  app.post('/api/v1/recipes/:recipeId/reviews', errorHandler.checkInvalidReview, recipeController.addReview);
};

