const mongoose=require("mongoose")
const Campground = require("../models/campground")
const cities=require("./cities")
const {descriptors,places}=require("./seedHelpers")
//connect the db yelp-camp
mongoose.connect("mongodb://localhost:27017/yelp-camp",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection open!")
}).catch((err)=>{
    console.log("OH NO ERROR!")
console.log(err)
})

const sample=(array)=> array[Math.floor(Math.random()*array.length)]

const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            // Your user ID
            author:"61b7c4a9b2c02655ef9b5a69",
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },
            images: [
                {
                  url: 'https://res.cloudinary.com/zihaozhe/image/upload/v1639625029/Yelpcamp/joshua-earle-tUb9a0RB04k-unsplash_vedy9r.jpg',
                  filename: 'Yelpcamp/joshua-earle-tUb9a0RB04k-unsplash_vedy9r'
                },
                {
                  url: 'https://res.cloudinary.com/zihaozhe/image/upload/v1639624458/Yelpcamp/yzzkw2lpmjnsja8co6mf.jpg',
                  filename: 'Yelpcamp/yzzkw2lpmjnsja8co6mf'
                },
                {
                  url: 'https://res.cloudinary.com/zihaozhe/image/upload/v1639624461/Yelpcamp/ptpbvm4ycu7yjh6yarc0.jpg',
                  filename: 'Yelpcamp/ptpbvm4ycu7yjh6yarc0'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})