const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const CampGround = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer  = require('multer');  
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/campgrounds", campgrounds.index);

router.post("/campgrounds", isLoggedIn, validateCampground, upload.array("image"), catchAsync(campgrounds.createCampground))

router.get("/campgrounds/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/campgrounds/:id", catchAsync(campgrounds.showCampground));

router.put("/campgrounds/:id", isLoggedIn, isAuthor, validateCampground, upload.array("image"), campgrounds.updateCampground);

router.delete("/campgrounds/:id", isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get("/campgrounds/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditForm);


module.exports = router;