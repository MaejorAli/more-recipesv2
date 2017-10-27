import db from '../db';


let idTracker = 0;


class Recipe {
  static addRecipe(req, res) {
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
    db.push(response);
    res.status(200).send({ message: 'Recipe Successfully saved and created', response });
  }
  static getRecipes(req, res) {
    res.status(200).send(db);
  }
  static removeRecipes(req, res) {
    for (let i = 0; i < db.length; i += 1) {
      if (db[i].id === parseFloat(req.params.recipeDbid)) {
        db.splice(i, 1);
      }
    }
    res.status(200).send({ message: 'Recipe deleted' });
  }

  static updateRecipes(req, res) {
    for (let i = 0; i <= db.length; i += 1) {
      if (db[i].recipeDbid === req.params.recipeDbid) {
        db[i].name = req.body.name || db.name;
        db[i].description = req.body.description || db.description;
        db[i].image = req.body.image || db.image;
        db[i].ingredients = req.body.ingredients || db.ingredients;
        db[i].directions = req.body.directions || db.directions;
      }
    }
    res.status(200).send({ message: 'Successfully Updated' });
  }
}
export default Recipe;
