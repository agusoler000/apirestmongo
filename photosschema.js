const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/photosdia2', 
    {useNewUrlParser: true , useUnifiedTopology: true},
   
    // console.log("Conectado")
   

);

const descriVal = (Description)=>{
    const control =
    (!Description)? fasle : Description.length < 10 ? false : true;
}

const Photos = new mongoose.Schema({

    Username: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, 
    URL: String,
    Title: String,
    Description: { type: String,
        validate: [descriVal, "La descripcion debe tener al menos 10 caracteres"]},
    

});

module.exports = mongoose.model("Photos", Photos)