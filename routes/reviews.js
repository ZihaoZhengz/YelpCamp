const express=require("express")
// let the router have access to the campground id
const router=express.Router({mergeParams:true})
const reviews=require("../controllers/reviews")
const ExpressError=require("../utils/ExpressError")
const catchAsync=require("../utils/catchAsync");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware")

router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview))

router.delete("/:review_id",isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview))

module.exports=router;