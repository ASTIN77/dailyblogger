var mongoose = require("mongoose");

// Mongoose Model Configuration

var BlogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", BlogSchema);
    

    
module.exports = mongoose.model("Blog", BlogSchema);