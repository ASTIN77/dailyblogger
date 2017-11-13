var mongoose = require("mongoose");
var Blog = require("./models/blog");


// define sample campground data for database initialisation

var data = [{
        title: "The Parrot Files",
        image: "https://wonderopolis.org/_img?img=/wp-content/uploads/2012/09/Macaws-shutterstock_9273904.jpg&transform=resizeCrop,720,450",
        body : "Lorem ipsum dolor sit amet, facilisi feugiat suspendisse nam nec convallis quis, donec sed ante ligula aliquet, nullam urna amet neque et, ligula amet. Ut eget, in semper vel id, nulla eget ut lorem eleifend. Consequat in sollicitudin odio magnis mauris non, egestas wisi ullamcorper consectetuer imperdiet aenean, mauris ornare etiam et sed, ornare non in metus sollicitudin, euismod dui tempus ligula. Pede scelerisque aliquam adipisicing gravida praesent felis, id dis dui. Donec etiam ut turpis eget ligula. Auctor aliquam ante nonummy, mattis scelerisque vestibulum mi. Dictumst tellus varius, leo ipsum ad blandit posuere sagittis tristique, orci nulla in accumsan, luctus metus euismod, quam nullam sit sapien. Risus donec est velit sem, suspendisse ultrices ut vivamus blandit curabitur. Mollis sit, at fuga sit netus. Vivamus cras, mattis erat augue ac mi, suscipit pede in posuere neque varius. Eos mattis nisl turpis nec sit at, fusce nulla a sodales. Tellus eros ipsum vestibulum auctor cras, odio hac lacus libero orci mauris tellus, blandit lectus sed laoreet justo, nam suscipit sodales magna sit, mi aliquam."
    },

    {
        title: "My First Car",
        image: "https://upload.wikimedia.org/wikipedia/en/1/10/Subaru_1983_4X4_My_First_Car.jpg",
        body: "Ex pri laudem fastidii interpretaris, explicari laboramus gloriatur mea te. Error integre accommodare ad per, ut eos meliore eligendi pericula, solum molestie no vim. Nostrum suavitate ne sed, mediocrem salutandi euripidis his te. Virtute insolens conclusionemque pro in, ea nec omnes referrentur. Everti mollis dolores cu has, natum explicari in qui, ut nec regione hendrerit. Te adipiscing neglegentur mea, ut eos quod case eloquentiam.."
    },

    {
        title: "Vacation in Scotland",
        image: "https://i.pinimg.com/originals/70/50/0d/70500d54a03d0d0d9bbfcf59a45a8106.jpg",
        body: "Pede egestas wisi sapien elit in, donec elit suspendisse, neque diam quam, id nulla iaculis in urna urna nascetur. Metus praesent ante feugiat, duis quis donec dignissim nulla velit felis. Accumsan in nec interdum, sodales in tincidunt sit vivamus at, sodales maecenas id quisque nunc consequatur, elit pellentesque. Commodo dui malesuada dolor, viverra venenatis, in platea consequat, tortor in neque do consectetuer non. Wisi lacus, dui quam quisque ac ullamcorper. Facilisi laoreet gravida integer risus, sit amet mi pellentesque ut, adipiscing cursus in, condimentum at sollicitudin lectus morbi amet sociis, et vivamus leo. Dolor a vel urna, libero non aptent rutrum ut, suspendisse quam non mi nec vel libero, quo nunc mi non vel id wisi."
    }

]


function seedDB() {

    // Remove all campgrounds
    Blog.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Cleared Blog Database");
            // add a few campgrounds
            console.log("Populating database with sample blogs");
            data.forEach(function(seed) {
                Blog.create(seed, function(err, blog) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Added a new blog.");
                            }

                        });
                    });
                }
            });
}


module.exports = seedDB;