const alphaNumeric = (inputtxt) => {
  const letterNumber = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
  if (inputtxt.match(letterNumber)) {
    return true;
  }
  return false;
};

const checkNullInput = (req, res, next) => {
  if (req.method !== 'POST') {
    return res.status(300).send({ message: 'Invalid request method' });
  }
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  const {
    recipeName,
    directions,
    ingredients,
  } = req.body;
  [recipeName, directions, ingredients].forEach((info) => {
    if (info === undefined) {
      isUndefined = true;
    }
    if (!isUndefined && !alphaNumeric(info)) {
      if (Number.isInteger(parseFloat(info))) {
        isString = false;
      }
    }
    if (!isUndefined) {
      if (info.trim().length < 1) {
        isNull = true;
      }
    }
  });
  if (isUndefined) {
    return res.status(400).send({ error: 'Invalid Input' });
  }
  if (isNull) {
    return res.status(400).send({ error: 'A field does not contain any input' });
  }
  if (!isString) {
    return res.status(400).send({ error: 'Only text can be inputed' });
  }
  return next();
};

const checkInvalidReview = (req, res, next) => {
  if (req.method !== 'POST') {
    return res.status(400).send({ error: 'Invalid request method' });
  }
  let isUndefined = false;
  let isNull = false;
  const { reviews } = req.body;
  const { recipeId } = req.params;
  [reviews, recipeId].forEach((params) => {
    if (params === undefined) {
      isUndefined = true;
    }
    if (!isUndefined) {
      if (params.trim().length < 1) {
        isNull = true;
      }
    }
  });
  if (isUndefined) {
    return res.status(400).send({ error: 'No review message found' });
  }
  if (isNull) {
    return res.status(400).send({ error: 'Your review cannot be empty text' });
  }
  if (!isUndefined && !alphaNumeric(reviews) && Number.isInteger(parseFloat(reviews))) {
    return res.status(400).send({ error: 'Your reviews should be text and not numbers' });
  }
  return next();
};

const checkInvalidModification = (req, res, next) => {
  const {
    recipeName,
    directions,
    ingredients,
  } = req.body;
  const modifiedFields = [];
  let isUndefined = false;
  let isNull = false;
  let isString = true;
  [recipeName, directions, ingredients].forEach((field) => {
    if (field !== undefined) {
      modifiedFields.push(field);
    }
  });
  if (modifiedFields.length === 0) {
    return res.status(400).send({ error: 'Please fill in the properties you want to modify' });
  }
  modifiedFields.forEach((info) => {
    if (info === undefined) {
      isUndefined = true;
    }
    if (!isUndefined && !alphaNumeric(info)) {
      if (Number.isInteger(parseFloat(info))) {
        isString = false;
      }
    }
    if (!isUndefined) {
      if (info.trim().length < 1) {
        isNull = true;
      }
    }
  });
  if (isUndefined) {
    return res.status(400).send({ error: 'Please fill in all fields' });
  }
  if (isNull) {
    return res.status(400).send({ error: 'A field does not contain any input' });
  }
  if (!isString) {
    return res.status(400).send({ error: 'Only text can be inputed' });
  }
  return next();
};

export default {
  checkNullInput,
  checkInvalidReview,
  checkInvalidModification,
};
