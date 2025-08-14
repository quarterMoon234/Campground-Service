const CampGround = require("../models/campground");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken : mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res) => {
    //    if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location,
        limit : 1
    }).send();
    const newCampGround = new CampGround(req.body.campground);
    newCampGround.geometry = geoData.body.features[0].geometry;
    newCampGround.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCampGround.author = req.user._id;
    await newCampGround.save();

    console.log(newCampGround);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampGround.id}`);
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    await campground.save();
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground.id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds")
}