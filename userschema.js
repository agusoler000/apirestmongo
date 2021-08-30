const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/photosdia2', 
    {useNewUrlParser: true , useUnifiedTopology: true},
   
    // console.log("Conectado")
   

)

const loguinVal = (Loguin) =>
{
   const control = (!Loguin)? false: (Loguin.length < 4)? false: true
    console.log(control);
    return control
};

 const passVal = (Password)=>{
       
  let control =  (!Password)? false: (Password.length < 6)? false: (Password.includes(" ")) ? false: true;
    console.log(control);
  
    return control
    
};

function emailVal(next){
    if(this.Email.includes("@")){
        next();
    }else{
        next(new Error("El Correo no tiene un formato valido"));
    }
};



const User = new mongoose.Schema({
    
    Loguin: { 
    type: String,
    validate: [
        loguinVal,
        'El loguin debe tener como minimo 4 caracteres'
    ]},

    Password: {
        type: String,
        validate: [
            passVal, 'La contraseña debe tener al menos 6 caracteres y ningun espacio en blanco'
        ]
    },
    Name: String,
    Surname: String,
    DateOfBird: Date,
    Comments: String,
    Role: String,
    enum: ["USER", "FULL-USER", "ADMIN"],
    Follow: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}] ,
    Adreess: String,
    Phone: String,
    Email: String
    
    


});

User.pre("save", emailVal)
module.exports = mongoose.model("User", User)

