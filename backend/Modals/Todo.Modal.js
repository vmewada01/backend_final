const mongoose =require("mongoose")

const TodoModel = new mongoose.Schema({
    taskname: {type: String, required: true},
    status: {type: Boolean, required: true},
    tag: {type: String, required: true , eval:["personal","official","family"]},
    userId:{type:String, required: true}
})

const Todo = mongoose.model("todo", TodoModel)

module.exports = {Todo}
