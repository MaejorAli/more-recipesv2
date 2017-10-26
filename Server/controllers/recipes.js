const db = require('../db.json');

const recipeDb = db.recipes;

let idTracker = 0;


class Recipe { 
  addRecipe(req, res) {
    const { recipeName, directions, ingredients } = req.body;
    const currentDate = '' + new Date();
    const createdAt = currentDate.slice(0, 24);
    const updatedAt = currentDate.slice(0, 24);
    const upvotes = 0;
    const downvotes = 0;
    const reviews = '';
    idTracker += 1;
    const id = idTracker;
    const response = {
      id,
      recipeName,
      directions,
      ingredients,
      createdAt,
      updatedAt,
      upvotes,
      downvotes,
      reviews,
    };
    recipeDb.push(response);
    res.status(200).send({ message: 'Recipe Successfully saved and created', response });
  }
}

export default Recipe;
