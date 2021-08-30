// -------Imports -------
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const User = require("./userschema");
const Photos = require("./photosschema");
const { response } = require("express");

//------Config------
const corsOptions = {
    "Access-Control-Allow-Methods": ['GET', 'PUT', 'POST', 'DELETE']
}
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//---Global V. ---
const urlDatabase = "mongodb://localhost:27017/photosdia2";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

//----- DB -----

mongoose.connect(
    urlDatabase,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
);

//--- methods ----
app.get("/photos", function (request, response) {
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };
    const ids = request.query.id

    if (ids) {
        Photos.find({ "Username": ids }).populate("Username")

            .then((res) => {
                sendBody.status = 200;
                sendBody.message = `Se muestran las fotos del usuario con ID: ${ids}`;
                sendBody.data = res;
                response.status(200).send(sendBody)
            })
            .catch((err) => {
                sendBody.status = 400
                sendBody.message = `Error con el ID: ${ids}`
                console.log(err);


            })
    }

});

app.post('/photos', function (request, response) {
    const { Username, URL, Title, Description } = request.body;
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };

    Photos.create({ Username, URL, Title, Description })

        .then((res) => {
            sendBody.status = 200;
            sendBody.message = `Se ha creado una nueva foto con ide ${response._id}`;
            sendBody.data = res;
            response.status(200).send(sendBody)
        })
        .catch((err) => {
            sendBody.status = 409
            sendBody.message = `Ha habido un error al subir la foto`
            response.status(409).send(sendBody)
            console.log(err);

        })

});

app.delete("/photos", function (request, response) {

    const { Username, Title } = request.body;
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };

    Photos.deleteOne({ Username, Title })

        .then((res) => {
            sendBody.status = 200;
            sendBody.message = `Se ha eliminado la foto de ${Username}`;
            sendBody.data = res;
            response.status(200).send(sendBody)
        })
        .catch((err) => {
            sendBody.status = 409
            sendBody.message = `Ha habido un error al intentar eliminar la foto`
            response.status(409).send(sendBody)
            console.log(err);

        })

})

app.delete("/photosuser", function (request, response) {

    const { Username } = request.body;
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };

    Photos.deleteMany({ Username })

        .then((res) => {
            sendBody.status = 200;
            sendBody.message = `Se han eliminado las fotos de ${Username}`;
            sendBody.data = res;
            response.status(200).send(sendBody)
        })
        .catch((err) => {
            sendBody.status = 409
            sendBody.message = `Ha habido un error al intentar eliminar las fotos`
            response.status(409).send(sendBody)
            console.log(err);

        })

});

app.put("/follow", function (request, response) {

    const { Loguin, Follow } = request.body;
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };

    User.updateOne({ "Loguin": Loguin }, { $push: { "Follow": Follow } })

        .then((res) => {
            sendBody.status = 200;
            sendBody.message = `${Follow} ha comenzado a seguir a ${Loguin}`;
            sendBody.data = res;
            response.status(200).send(sendBody)
        })
        .catch((err) => {
            sendBody.status = 409
            sendBody.message = `Ha habido un error ${Follow} o  ${Loguin} no existen, o ya se siguen`
            response.status(409).send(sendBody)
            console.log(err);
        })
});

app.put("/unfollow", function (request, response) {

    const { Loguin, Follow } = request.body;
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };

    User.updateOne({ Loguin, Follow }, { $pull: { "Follow": Follow } })

        .then((res) => {
            sendBody.status = 200;
            sendBody.message = `${Follow} ha dejado de seguir a ${Loguin}`;
            sendBody.data = res;
            response.status(200).send(sendBody)
        })
        .catch((err) => {
            sendBody.status = 409
            sendBody.message = `Ha habido un error ${Follow} o  ${Loguin} no existen, o ya se siguen`
            response.status(409).send(sendBody)
            console.log(err);
        })
});


app.get("/timeline", function (request, response) {
    let sendBody = {
        "status": null,
        "message": null,
        "data": null
    };
    const ids = request.query.id

    if (ids) {
        const timelinefound = User.findOne({"_id": ids}).populate({path: 'Follow', populate: {path: "Photos"}})

            .then((res) => {
                sendBody.status = 200;
                sendBody.message = `Se muestran las fotos del usuario con ID: ${ids}`;
                sendBody.data = res;
                response.status(200).send(sendBody)
            })
            .catch((err) => {
                sendBody.status = 400
                sendBody.message = `Error con el ID: ${ids}`
                console.log(err);


            })
    }

});







app.listen(PORT, HOST, () => {
    console.log(`API CONNECTED TO PORT ${PORT} and HOST ${HOST}`);
});
