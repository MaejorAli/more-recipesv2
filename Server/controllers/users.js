import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';


const { Users } = models;
const { Recipes } = models;

const secret = process.env.SECRET;

class User {
  static signup(req, res) {
    const {
      email,
      firstname,
      lastname,
      username,
    } = req.body;
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) {
        return res.status(500).send({ error: 'an error occurred' });
      }
      const password = hash;
      return Users
        .create({
          firstname,
          lastname,
          username,
          email,
          password,
        })
        .then((user) => {
          const payload = {
            userId: user.id,
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: '10h', // expires in 1 hours
          });
          res.status(200).send({ message: 'You have successfully signed up', token });
        })
        .catch((error) => {
          if (error.message === 'Validation error') {
            res.status(400).send({ error: 'email or username already exists' });
          } else {
            res.status(400).send({ error: 'an error occured' });
          }
        });
    });
  }

  static signin(req, res) {
    const {
      email,
      password,
    } = req.body;
    return Users
      .findOne({
        where: {
          email,
        },
      })
      .then((user) => {
        if (!user) {
          return res.status(400).send({ error: 'Invalid email or password' });
        }
        bcrypt.compare(password, user.password, (err, response) => {
          if (response) {
            const payload = {
              userId: user.identifier,
            };
            const token = jwt.sign(payload, secret, {
              expiresIn: '10h', // expires in 1 hours
            });
            return res.status(200).send({ message: 'You have successfully logged in', token });
          }
          return res.status(400).send({ error: 'Invalid Username or password' });
        });
      })
      .catch(error => res.status(500).send({ error: 'an error occurred' }));
  }

  static getUserFavoriteRecipes(req, res) {
    return Users.findById(req.params.userId)
      .then((user) => {
        user.getFavorites({
          attributes: [],
          include: [{
            model: Recipes,
          }],
        })
          .then((userFavourites) => {
            res.status(200).send({ message: 'Success', userFavourites });
          })
          .catch(error => (500).send({ error: `an error occured: ${error.message}` }));
      })
      .catch((error) => {
        if (error.message === `invalid input syntax for uuid: \"${req.params.userId}\"`) {
          return res.status(400).send({ error: 'You sent an invalid Id,try better next time' });
        }
        return res.status(500).send({ error: `an error occured: ${error.message}` });
      });
  }

  static getAllUsers(req, res) {
    return Users
      .findAll()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(500).send({ error: `an error occurred ${error.message}` }));
  }
}
export default User;
