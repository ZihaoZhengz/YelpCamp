const Campground = require("../models/campground")
const cloudinary=require("cloudinary")
const mbxGencoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN;
const gencoder=mbxGencoding({accessToken:mapBoxToken});

module.exports.index=async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render("campgrounds/index",{campgrounds})
}

module.exports.createCampground=async (req,res,next)=>{
    const genData=await gencoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const geometry=genData.body.features[0].geometry;
    const campground=new Campground(req.body.campground)
    campground.images=req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.author=req.user._id;
    campground.geometry=geometry;
    await campground.save()
    req.flash("success","Successfully made a new campground!")
    id=campground._id 
    res.redirect(`campgrounds/${id}`)
}

module.exports.renderNewForm=(req,res)=>{
    res.render("campgrounds/new")
}

module.exports.showCampground=async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash("error","Can not find the campground")
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/show",{campground})
}

module.exports.renderEditForm=async (req,res)=>{
    const id=req.params.id;
    const campground= await Campground.findById(id)
    if(!campground){
        req.flash("error","Can not find the campground")
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit",{campground})
}

module.exports.updateCampground=async (req,res)=>{
    const genData = await gencoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const geometry=genData.body.features[0].geometry;
    const id=req.params.id;
    const campground= await Campground.findByIdAndUpdate(id,req.body.campground)
    campground.geometry=geometry;
    const images=req.files.map(f=>({url:f.path, filename:f.filename}));
    campground.images.push(...images)
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash("success","Successfully updated a campground!")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    const images=campground.images;
    for(let image of images){
        await cloudinary.uploader.destroy(image.filename)
    }
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success","Successfully deleted a campground!")
    res.redirect("/campgrounds")
}