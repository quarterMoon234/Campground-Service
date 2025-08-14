const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/campgrounds/:id/reviews", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/campgrounds/:campgroundId/reviews/:reviewId", isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;