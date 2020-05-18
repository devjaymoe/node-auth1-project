const bcryptjs = require('bcryptjs');
const router = require("express").Router();

const Users = require("../users/users-model.js");
const { isValid } = require('../users/validation.js');

router.post('/register', (req, res)=>{
  const credentials = req.body;

  if(isValid(credentials)) {

    const rounds = process.env.BCRYPT_ROUNDS || 8
    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    
    credentials.password = hash;
    
    // save the user to the database
    Users.add(credentials).then(user => {
      // log in user after successful registration
      req.session.loggedIn = true;
      res.status(201).json({ data: user })
    })
    .catch( err => {
      res.status(500).json({ error: err.message })
    });

  } else {
    res.status(400).json({ message: 'please provide username and password and password should be a string'})
  }
});

router.post('/login', (req, res)=>{

  const {username, password} = req.body;

  if(isValid(req.body)) {

    Users.findBy({ username })
    .then(([user]) => {
      // compare the password to the hash stored in the database
      if( user && bcryptjs.compareSync(password, user.password)){
        // we can save information about the client inside the session (req.session)
        // saved on server on session obj
        req.session.loggedIn = true;
        req.session.user = user;

        res.status(200).json({ message: 'Welcome to our API' })
      } else {
        res.status(401).json({ message: 'invalid credentials' })
      }
    })
    .catch( err => {
      res.status(500).json({ error: err.message })
    });

  } else {
    res.status(400).json({ message: 'please provide username and password and password should be a string'})
  }
});

router.get('/logout', (req, res) => {
  // end session
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: 'we could not log you out, try later please'})
      } else {
        res.status(204).end();
      }
    })
  } else {
    res.status(204).end();
  }
});

module.exports = router;