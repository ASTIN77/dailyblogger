var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    Blog            = require("./models/blog"),
    seedDB          = require("./seeds"),
    methodOverride  = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
    
// Mongoose Database Connection

    mongoose.connect(process.env.BLOGGERURL, { useNewUrlParser: true, useUnifiedTopology: true });
    
    
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    


// Populate the Blog database with sample blogs

seedDB();



// RESTful Routes

// Index Routes

app.get("/", function(req,res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err,blogs){
        if(err){
            console.log(err);
        } else {
             res.render("index", {blogs: blogs});          
        }
    });
   
});
    
// NEW ROUTE

app.get("/blogs/new", function(req,res){
    res.render("new");
});


// CREATE ROUTE 

app.post("/blogs", function(req,res){
    //use line to sanitize body comments for to remove
    // any scripts that a user may inject
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    // create new blog
    
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});
    
// SHOW ROUTE

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});        
        }
    });
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("blogs");
        } else {
            
            res.render("edit", {blog: foundBlog});
        }
    });
    
});

// UPDATE ROUTE

app.put("/blogs/:id", function(req,res){
    
        //use line to sanitize body comments for to remove
        // any scripts that a user may inject
        req.body.blog.body = req.sanitize(req.body.blog.body);
    
        Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
            if(err){
                res.redirect("/index");
            } else{
                res.redirect("/blogs/" + req.params.id);
            }
        });    
});
    
    
// DESTROY ROUTE

app.delete("/blogs/:id", function(req,res){
     Blog.findByIdAndRemove(req.params.id, function(err){
         if(err){
            res.redirect("/blogs") ;
         } else {
          res.redirect("/blogs") ;   
         }
     });
});
    
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("Blog Application Server Started Successfully");
    });