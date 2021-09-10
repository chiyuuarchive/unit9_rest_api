// Import modules
const express = require('express');

// Construct a router instance
const router = express.Router();

// Import the users and courses models
const { User } = require("../models");
const { Course } = require("../models");

// For user authentication
const { authenticateUser } = require("../middleware/auth-user");

// Async handler
function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        console.log("asyncHandler error handler called");
        next(error);
      }
    }
  }


/* GET Courses Route */
router.get("/courses", asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: [{ 
      model: User,
      as: "teacher",
      attributes: {exclude: ["id", "createdAt", "updatedAt", "password"]}
     }],
    attributes: {exclude: ["id", "userId", "createdAt", "updatedAt"]}
  });
  res.status(200).json(courses);
}));


/* POST Courses Route with authentication */
router.post("/courses", authenticateUser, asyncHandler(async (req, res) => {
  try {

    console.log(req.body);

    const course = await Course.create({
      "title": req.body.title,
      "description": req.body.description,
      "userId": req.currentUser.id
    });
    res.status(201).location(`api/courses/${req.body.id}`).end();
  }
  catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      console.log("Seq Error catched!")
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } 
    else {
      console.log("An error has been thrown!");
      throw error;
    }
  }
}));


/* GET Course ID Route */
router.get("/courses/:id", asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: [{ 
      model: User,
      as: "teacher",
      attributes: {exclude: ["id", "createdAt", "updatedAt", "password"]}
     }],
    attributes: {exclude: ["id", "userId", "createdAt", "updatedAt"]}
  });
  res.status(200).json(course);
}));


/* PUT Course ID Route with authentication */
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  const errors = [];

  console.log(req.body);
  let course = await Course.findByPk(req.params.id);

  if (req.currentUser.id == course.userId) {
    if (!req.body.title) {
      errors.push("Please provide a title for the course");
    }
    if (!req.body.description) {
      errors.push("Please provide a description for the course");
    }

    if (errors.length > 0 ) {
      res.status(400).json({ errors });
    }
    else if (!course) {
      res.status(404).json({"message": "Course Not Found"})
    }
    else {
      await course.update(req.body);
      res.status(204).end();
    }
  }
  else {
    res.status(401).json({"message": "Access Denied"});
  }
}));


/* DELETE Course ROUTE with authentication*/
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);

  if (req.currentUser.id == course.userId) {
    await course.destroy();
    res.status(204).end();
  }
  else {
    res.status(401).json({"message": "Access Denied"});
  }
  
}))


/* GET Users Route with authentication */
router.get("/users", authenticateUser, asyncHandler(async (req, res) => {
  console.log(req.currentUser);
  
  const user = await User.findByPk(req.currentUser.id);
  res.status(200).json(user);
}));


/* POST User Route */
router.post("/users", asyncHandler(async(req, res) => {
  try {
    console.log(req.body);
    await User.create(req.body);
    res.status(201).location("/").end();
  } 
  catch (error) {
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
      console.log("Seq Error catched!")
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } 
    else {
      console.log("An error has been thrown!");
      throw error;
    }
  }
}));


module.exports = router;