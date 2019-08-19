const express = require("express");
const router = express.Router();
const db = require("../config/database");
const Gig = require("../models/Gig");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Getgig List
router.get("/", async (req, res) => {
  try {
    const gigs = await Gig.findAll();
    if (gigs) {
      console.log(gigs);
      res.render("gigs", {
        gigs
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Display add gig form

router.get("/add", (req, res) => {
  res.render("add");
});

// Add a gig
router.post("/add", async (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  const errors = [];

  // Validate Fields
  if (!title) {
    errors.push({ text: "Please add a title." });
  }
  if (!technologies) {
    errors.push({ text: "Please add some technologies." });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email
    });
  } else {
    if (!budget) {
      budget = "Unkown";
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    // insert into table
    try {
      const newGig = await Gig.create({
        title,
        technologies,
        budget,
        description,
        contact_email
      });

      if (newGig) return res.redirect("/gigs");
    } catch (error) {
      console.log(error);
    }
  }
});

// Search for gigs
router.get("/search", async (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();

  try {
    const gigs = await Gig.findAll({
      where: { technologies: { [Op.like]: `%${term}%` } }
    });
    return res.render("gigs", { gigs });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
