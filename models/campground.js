const mongoose=require("mongoose")
const Review=require("./review")
const Schema=mongoose.Schema;

const ImageSchema=new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/c_fill,w_200,h_300")
})

ImageSchema.virtual("fill").get(function(){
    return this.url.replace("/upload","/upload/c_fill,w_415,h_415")
})

ImageSchema.virtual("showSize").get(function(){
    return this.url.replace("/upload","/upload/c_fill,w_636,h_425")
})

const opts={toJSON:{virtuals:true}};
const CampgroundSchema=new Schema({
title:String,
images:[ImageSchema],
price: Number,
description: String,
geometry:{
    type:{
        type:String,
        enum:["Point"],
        // required:true
    },
    coordinates:{
        type:[Number],
        required:true
    }
},
location:String,
author:{
type:Schema.Types.ObjectId,
ref:"User"
},
reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review"
}]
},opts);

// replace the @ with " in the clusterMap.js because JSon cannot identify the '""'
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href=@/campgrounds/${this._id}@>${this.title}</a><strong><p>${this.description.substring(0, 20)}...</p>`
});

CampgroundSchema.post("findOneAndDelete", async (campground)=>{
   await Review.deleteMany({
       _id:{
           $in:campground.reviews
       }
   })
})
// export the collection object
module.exports=mongoose.model("Campground",CampgroundSchema)
