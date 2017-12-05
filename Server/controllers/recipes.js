import db from '../db';
import { descUpvotes, ascUpvotes } from '../middlewares/sortUpvotes';

let idTracker = 0;


class Recipe {
  static addRecipe(req, res) {
    const { recipeName, directions, ingredients } = req.body;
    const currentDate = `${new Date()}`;
    const createdAt = currentDate.slice(0, 24);
    const updatedAt = currentDate.slice(0, 24);
    const upvotes = 0;
    const downvotes = 0;
    const reviews = '';
    idTracker = db.length + 1;
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
    res.status(201).send({ message: 'Recipe Successfully saved and created', error: false, response });
  }

  static removeRecipes(req, res) {
    for (let i = 0; i < db.length; i += 1) {
      if (db[i].id === parseFloat(req.params.recipeId)) {
        db.splice(i, 1);
        return res.status(200).send({ message: 'Recipe deleted', error: false });
      }
    }
    return res.status(404).send({ message: 'Not Found', error: true });
  }

  static updateRecipes(req, res) {
    const id = parseFloat(req.params.recipeId);
    let recipe = null;
    db.map((rec) => {
      if (rec.id === id) {
        recipe = rec;
      }
      return recipe;
    });
    if (recipe) {
      recipe.recipeName = req.body.recipeName || recipe.recipeName;
      recipe.image = req.body.image || recipe.image;
      recipe.ingredients = req.body.ingredients || recipe.ingredients;
      recipe.directions = req.body.directions || recipe.directions;
      res.status(201).send({ message: 'Successfully Updated', error: false });
    } else {
      res.status(404).send({ message: 'Recipe not found', error: true });
    }
  }


  static addReview(req, res) {
    for (let i = 0; i < db.length; i += 1) {
      if (db[i].id === parseFloat(req.params.recipeId)) {
        db[i].reviews += req.body.reviews || db.reviews;
        res.status(200).send({ message: 'Review successfully Posted', error: false });
      }
    }
  }


  static getRecipes(req, res) {
    if (req.query.sort === 'upvotes') {
      if (req.query.order.toLowerCase() === 'des') {
        db.sort(descUpvotes);
      } else {
        db.sort(ascUpvotes);
      }
      res.status(200).send({ recipes: db, error: false });
    } else { res.status(200).send({ error: false, recipes: db }); }
  }
}
export default Recipe;
