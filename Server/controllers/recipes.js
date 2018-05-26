import models from '../models';

const { Recipes } = models;
const { Reviews } = models;
const { Favorites } = models;
const { votes } = models;


class Recipe {
  static addRecipe(req, res) {
    const {
      recipeName,
      directions,
      ingredients,
    } = req.body;

    return Recipes
      .create({
        recipeName,
        directions,
        ingredients,
        creatorId: req.decoded.userId,
      })
      .then(recipe => res.status(200).send({ message: 'Success, recipe created', recipe }))
      .catch(error => res.status(400).send({ error: error.message }));
  }

  static deleteRecipe(req, res) {
    const { recipeId } = req.params;
    return Recipes
      .findOne({
        where: {
          id: recipeId,
        },
      })
      .then((recipe) => {
        if (!recipe) {
          return res.status(400).send({ error: 'Recipe you intended to delete not found' });
        }
        if (recipe.creatorId !== req.decoded.userId) {
          return res.status(403).send({ error: 'You cannot delete a recipe added by another user' });
        }
        return recipe.destroy().then(res.status(200).send({ message: 'recipe successfully deleted' })).catch(error => res.status(500).send({ error: error.message }));
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${recipeId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: error.message });
      });
  }

  static getAllRecipes(req, res) {
    return Recipes
      .findAll()
      .then((recipes) => {
        if (recipes.length < 1) {
          return res.status(404).send({ message: 'No recipes found' });
        }
        if (req.query.sort === 'upvotes' && req.query.order === 'desc') {
          recipes.sort((a, b) => b.upvotes - a.upvotes);
        }
        return res.status(200).send({
          message: 'Success',
          recipes,
        });
      })
      .catch(error => res.status(500).send({ error: error.message }));
  }

  static getARecipe(req, res) {
    const { recipeId } = req.params;
    return Recipes
      .findOne({
        where: {
          id: recipeId,
        },
      })
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).send({ error: 'Recipe you intended to get cannot be found' });
        }
        return res.status(200).send({ message: 'Success', recipe });
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${recipeId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: error.message });
      });
  }

  static postReview(req, res) {
    const {
      message,
      rating,
    } = req.body;
    const { userId } = req.decoded;
    const { recipeId } = req.params;
    return Reviews
      .create({
        message,
        rating,
        userId,
        recipeId,
      })
      .then((review) => {
        Recipes.findById(recipeId)
          .then((recipe) => {
            recipe.updateAttributes({
              reviews: recipe.reviews + 1,
            });
            return res.status(200).send({ message: 'You have successfully reviewed the recipe', review });
          })
          .catch(error => res.status({ error: error.message }));
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${recipeId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: error.message });
      });
  }

  static modifyRecipe(req, res) {
    const { recipeId } = req.params;
    return Recipes
      .findOne({
        where: {
          id: recipeId,
        },
      })
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).send({ error: 'Recipe you intended to modify cannot be found' });
        }
        if (recipe !== null && recipe.creatorId !== req.decoded.userId) {
          return res.status(404).send({ message: 'You cannot modify a recipe added by another User' });
        }
        recipe.updateAttributes({
          recipeName: req.body.recipeName || recipe.recipeName,
          directions: req.body.directions || recipe.directions,
          ingredients: req.body.ingredients || recipe.ingredients,
        });
        return res.status(200).send({ message: 'recipe successfully modified' });
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${req.params.userId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: error.message });
      });
  }

  static downvoteRecipe(req, res) {
    return votes
      .findOne({
        where: {
          recipeId: req.params.recipeId,
          voteType: 'downvote',
        },
      })
      .then((vote) => {
        if (vote !== null && vote.userId === req.decoded.userId) {
          Recipes
            .findOne({
              where: {
                id: req.params.recipeId,
              },
            })
            .then((recipe) => {
              recipe.updateAttributes({
                downvotes: recipe.downvotes - 1,
              });
            })
            .catch(error => res.status(500).send({ error: `me  eeee:${error.message}` }));
          return vote.destroy().then(res.status(200).send({ message: 'You have previously downvoted this recipe,your last downvote no longer counts' })).catch(error => res.status(500).send({ error: error.message }));
        }
        if (!vote || vote.userId !== req.decoded.userId) {
          votes
            .create({
              recipeId: req.params.recipeId,
              userId: req.decoded.userId,
              voteType: 'downvote',
            })
            .then(() => Recipes
              .findOne({
                where: {
                  id: req.params.recipeId,
                },
              })
              .then((recipe) => {
                recipe.updateAttributes({
                  downvotes: recipe.downvotes + 1,
                });
                return res.status(200).send({ message: 'hurray,You have successfully downvote the recipe' });
              })
              .catch(error => res.status(500).send({ error: `${error.message}` })))
            .catch(error => res.status(500).send({ error: `${error.message}` }));
        }
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${req.params.userId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: `an error occured: ${error.message}` });
      });
  }

  static upvoteRecipe(req, res) {
    return votes
      .findOne({
        where: {
          recipeId: req.params.recipeId,
          voteType: 'upvote',
        },
      })
      .then((vote) => {
        if (vote !== null && vote.userId === req.decoded.userId) {
          Recipes
            .findOne({
              where: {
                id: req.params.recipeId,
              },
            })
            .then((recipe) => {
              recipe.updateAttributes({
                upvotes: recipe.upvotes - 1,
              });
            })
            .catch(error => res.status(500).send({ error: `me  eeee:${error.message}` }));
          return vote.destroy().then(res.status(200).send({ message: 'You have previously upvoted this recipe,your last upvote no longer counts' })).catch(error => res.status(500).send({ error: `An error ocurred ${error.message}` }));
        }
        if (!vote || vote.userId !== req.decoded.userId) {
          votes
            .create({
              recipeId: req.params.recipeId,
              userId: req.decoded.userId,
              voteType: 'upvote',
            })
            .then(() => Recipes
              .findOne({
                where: {
                  id: req.params.recipeId,
                },
              })
              .then((recipe) => {
                recipe.updateAttributes({
                  upvotes: recipe.upvotes + 1,
                });
                return res.status(200).send({ message: 'hurray,You have successfully upvote the recipe' });
              })
              .catch(error => res.status(500).send({ error: `${error.message}` })))
            .catch(error => res.status(500).send({ error: `${error.message}` }));
        }
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${req.params.userId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: `an error occured: ${error.message}` });
      });
  }

  static favoriteRecipe(req, res) {
    return Favorites
      .findOne({
        where: {
          recipeId: req.params.recipeId,
        },
      })
      .then((favorite) => {
        if (favorite !== null && favorite.userId === req.decoded.userId) {
          Recipes
            .findOne({
              where: {
                id: req.params.recipeId,
              },
            })
            .then((recipe) => {
              recipe.updateAttributes({
                favorites: recipe.favorites - 1,
              });
            })
            .catch(error => res.status(500).send({ error: error.message }));
          return favorite.destroy().then(res.status(200).send({ message: 'You have previously favorited this recipe,your last favorite no longer counts' })).catch(error => res.status(500).send({ error: `An error ocurred ${error.message}` }));
        }
        if (!favorite || favorite.userId !== req.decoded.userId) {
          Favorites
            .create({
              recipeId: req.params.recipeId,
              userId: req.decoded.userId,
            })
            .then(() => {
              Recipes
                .findOne({
                  where: {
                    id: req.params.recipeId,
                  },
                })
                .then((recipe) => {
                  recipe.updateAttributes({
                    favorites: recipe.favorites + 1,
                  });
                  return res.status(200).send({ message: 'hurray,You have successfully favorited the recipe' });
                })
                .catch(error => res.status(500).send({ error: error.message }));
            })
            .catch(error => res.status(500).send({ error: error.message }));
        }
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: ${req.params.userId}`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: error.message });
      });
  }
}

export default Recipe;
