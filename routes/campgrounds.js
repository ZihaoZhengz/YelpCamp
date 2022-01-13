const express=require("express");
const ExpressError=require("../utils/ExpressError")
const catchAsync=require("../utils/catchAsync");
const campgrounds=require("../controllers/campgrounds")
const router=express.Router()
const {isLoggedIn,validateCampground,isAuthor}=require("../middleware")

// multer: handling the multipart/form-data for uploading files
// storage: A multer storage engine for Cloudinary.
// upload: denote the uploaded data's destination
const {storage}=require("../cloudinary")
const multer  = require('multer')
const upload = multer({ storage})


router.route("/").get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("images"),validateCampground,catchAsync(campgrounds.createCampground)) 

router.get("/new",isLoggedIn,campgrounds.renderNewForm)

router.route("/:id").get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array("images"),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports=router