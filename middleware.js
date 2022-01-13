const Campground = require("./models/campground")
const Review = require("./models/review")
const {campgroundSchema,reviewSchema}=require("./schema")
const ExpressError=require("./utils/ExpressError")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash("error","You must firstly sign in!")
       return  res.redirect("/login")
    }
    next()
}
module.exports.validateCampground=(req,res,next)=>{
    const schema=campgroundSchema;
    // schema.validate({});
// -> { value: {}, error: '"username" is required' }
    const {error}=schema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg)
    }else{
        next()
    }
}
module.exports.isAuthor=async (req,res,next)=>{
    const id=req.params.id;
    const campground= await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash("error","You do not have the permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const schema=reviewSchema;
    // schema.validate({});
// -> { value: {}, error: '"username" is required' }
    const {error}=schema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(",");
        throw new ExpressError(400,msg)
    }else{
        next()
    }
}

// to indentify whether the author of review is as the same person as the user's ID
module.exports.isReviewAuthor=async (req,res,next)=>{
    const {review_id,id}=req.params;
    const review=await Review.findById(review_id);
    if(!review.author.equals(req.user._id)){
        req.flash("error","You do not have the permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}