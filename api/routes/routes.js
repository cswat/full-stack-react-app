const express = require("express");
const router = express.Router();

//Hashing tool for passwords
const bcryptjs = require("bcryptjs");

//Authorization header parsing tool
const auth = require("basic-auth");

const { User, Course } = require("../db").models;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

//Custom authentication middleware function
const authenticateUser = async (req, res, next) => {
  let message = null;
  // Parse user credentials from Authorization header
  const credentials = auth(req);
  // Identify valid credentials
  if (credentials) {
    // Looks up user in database by e-mail
    const user = await User.findOne({
      where: { emailAddress: credentials.name }
    });
    // If user was found, compare passwords
    if (user) {
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }
  // Handles user authentication pass/fail
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};

//When user is authenticated, return user
router.get("/users", authenticateUser, asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.currentUser.dataValues.id, {
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    });
    res.status(200).json(user);
}));

//Validate/create new users
router.post("/users", asyncHandler(async (req, res, next) => {
  try {
    const user = req.body;
    if (user.password) {
      user.password = bcryptjs.hashSync(user.password);
    }
    if (!user.emailAddress) {
      user.emailAddress = "";
    }
    await User.findOrCreate({ where: { emailAddress: user.emailAddress }, defaults: user })
      .then(([user, created]) => {
        if (created) {
          console.log("New user successfully created");
          res.status(201).set("Location", "/").end();
        } else {
          res.status(200).set("Location", "/").json({ message: `An account already exists with the email address ${user.emailAddress}`});
        }
      });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessages = error.errors.map(error => error.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      throw error;
    }
  }
}));

//Return list of courses for main page (GET)
router.get("/courses", asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      }
    ] //list of associations to load
  });
  res.status(200).json(courses);
}));

//Return specific course based on id (GET)
router.get("/courses/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: { exclude: ["createdAt", "updatedAt"] },
    include: [
      {
        model: User,
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      }
    ] 
  });
  if (course) {
    res.status(200).json(course);
  } else {
    res.sendStatus(404);
  }
}));

//Create new course and route (POST)
router.post("/courses", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  try {
    req.body.userId = user.dataValues.id;
    const course = await Course.create(req.body);
    const courseId = course.dataValues.id;
    res.status(201).set("Location", `/courses/${courseId}`).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessages = error.errors.map(error => error.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      throw error;
    }
  }
}));

//Update course (PUT)
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === user.dataValues.id) {
        if (req.body.title && req.body.description) {
          req.body.userId = user.dataValues.id; //prevent accidental override of course owner
          await course.update(req.body);
          res.status(204).end(); 
        } else {
          res.status(400).json({ message: "Please provide both a title and a description" });
        }
      } else {
        res.status(403).json({ message: "Access Denied" });
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const errorMessages = error.errors.map(error => error.message);
      res.status(400).json({ errors: errorMessages });
    } else {
      throw error;
    }
  }
}));

//Delete course (DELETE)
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (course) {
    if (course.userId === user.dataValues.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ message: "Access Denied" });
    }
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
