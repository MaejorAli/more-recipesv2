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
<<<<<<< HEAD
        res.status(200).send({ message: 'Recipe deleted', error: false });
      }
    }
  }

  static updateRecipes(req, res) {
    const id = parseFloat(req.params.recipeId);
    let recipe = null;
    db.map((rec) => {
      if (rec.id === id) {
        recipe = rec;
=======
        res.status(200).send({ message: 'Recipe deleted' });
      }
    }
    res.status(404).send({ message: 'Recipe not Found' });
  }

  static updateRecipes(req, res) {
    for (let i = 0; i < db.length; i += 1) {
      if (db[i].id === parseFloat(req.params.recipeDbid)) {
        db[i].recipeName = req.body.recipeName || db.recipeName;
        db[i].image = req.body.image || db.image;
        db[i].ingredients = req.body.ingredients || db.ingredients;
        db[i].directions = req.body.directions || db.directions;
        res.status(200).send({ message: 'Successfully Updated' });
>>>>>>> 5a362650c8975b3f77bc4017383433c61f59fcb7
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
<<<<<<< HEAD
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
=======
    res.status(404).send({ message: ' Not Found' });
>>>>>>> 5a362650c8975b3f77bc4017383433c61f59fcb7
  }
}
export default Recipe;
