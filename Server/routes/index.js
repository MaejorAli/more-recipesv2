import recipeController from '../controllers/recipes';
import errorHandler from '../middlewares/errors';
import auth from '../middlewares/auth';

export default (app) => {
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to the more-recipes Api' });
  });

  app.post('/api/v1/recipes', auth, errorHandler.checkNullInput, recipeController.addRecipe);
  app.get('/api/v1/recipes', recipeController.getAllRecipes);
  app.delete('/api/v1/recipes/:recipeId', recipeController.deleteRecipe);
  app.put('/api/v1/recipes/:recipeId', errorHandler.checkInvalidModification, recipeController.modifyRecipe);
  app.post('/api/v1/recipes/:recipeId/reviews', errorHandler.checkInvalidReview, recipeController.postReview);
};

