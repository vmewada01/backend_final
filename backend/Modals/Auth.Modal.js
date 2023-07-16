const mongoose =require("mongoose")

const AuthModel = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    
})

const Auth = mongoose.model("user", AuthModel)

module.exports = {Auth}
