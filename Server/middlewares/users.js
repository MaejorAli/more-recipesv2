const isValidEmail = (mail) => {
  if (/^\w+([\.-]?\w+)*@\w+([ \.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};

const checkInvalidUserDetails = (req, res, next) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    confirmpassword,
  } = req.body;
  const matchingDetails = {
    0: 'firstname',
    1: 'lastname',
    2: 'username',
    3: 'email',
    4: 'password',
    5: 'confirmpassword',
  };
  const reqBody = [firstname, lastname, username, email, password, confirmpassword];
  let undefinedBody;
  let isNull = false;
  let isDigit = false;
  for (let i = 0; i < reqBody.length; i += 1) {
    if (reqBody[i] === undefined) {
      undefinedBody = matchingDetails[i];
    }
    if (!undefinedBody) {
      if (reqBody[i].trim().length < 1) {
        isNull = true;
      }
    }
  }

  [firstname, lastname, username].forEach((field) => {
    if (!undefinedBody && Number.isInteger(parseFloat(field))) {
      isDigit = true;
    }
  });

  if (undefinedBody) {
    return res.status(400).send({ error: `Please input ${undefinedBody}` });
  }
  if (isNull) {
    return res.status(400).send({ error: 'Please fill in all input field' });
  }
  if (req.body.password.length < 6) {
    return res.status(400).send({ error: 'password must be at least six characters long' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).send({ error: 'Please enter a valid email' });
  }
  if (isDigit) {
    return res.status(400).send({ error: 'Your names cannot be digits only' });
  }
  if (password !== confirmpassword) {
    return res.status(400).send({ error: 'password and confirmpassword are not equal' });
  }
  next();
};

const checkInvalidUserSignIn = (req, res, next) => {
  if (req.body.email === undefined) {
    return res.status(400).send({ error: 'Please Input email' });
  }
  if (req.body.password === undefined) {
    return res.status(400).send({ error: 'Please Input password' });
  }
  if (req.body.email.trim().length < 1) {
    return res.status(400).send({ error: 'Please fill in all input fields' });
  }
  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ error: 'Given email is not a valid email' });
  }
  if (req.body.email.trim().length < 1) {
    return res.status(400).send({ error: 'Please fill in all input fields' });
  }
  next();
};

export default {
  checkInvalidUserDetails,
  checkInvalidUserSignIn,
};
