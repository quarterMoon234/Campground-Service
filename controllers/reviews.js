const CampGround = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash("success", "Successfully create a new review!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { campgroundId, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(campgroundId, { $pull : { reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${campgroundId}`);
}