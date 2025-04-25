const Listing = require("../model/listings");

module.exports.index = async (req, res, next) => {
  let data = await Listing.find();
  res.render("allData.ejs", { data });
};

module.exports.renderNewForm = (req, res) => {
  res.render("new.ejs");
};

module.exports.showRout = async (req, res, next) => {
  let { id } = req.params;
  let data = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!data) {
    req.flash("success", "Listing you requested for does not exist!");
    res.redirect("/listings");
  } else {
    res.render("show.ejs", { data });
  }
};

module.exports.created = async (req, res, next) => {
  let data = req.body.Listing;
  let listing = new Listing({ ...data });
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "New Listing Created !");
  res.redirect("/listings");
};

module.exports.edit = async (req, res, next) => {
  let { id } = req.params;
  let userData = await Listing.findById(id);
  res.render("edit.ejs", { userData });
};

module.exports.update = async (req, res, next) => {
  let { id } = req.params;
  let data = req.body.Listing;
  await Listing.findByIdAndUpdate(id, { ...data });
  req.flash("success", "Listing Updated !");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect(`/listings`);
};
