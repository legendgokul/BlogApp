var express = require("express"),
	methodOverride = require("method-override"),
    mongoose=require("mongoose"),
    app = express();

// better way of defineing body-parser.
const bodyParser = require('body-parser');


// we have to use these below 2 line to remove any server side error .
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/restful_blog_app", { useNewUrlParser: true });

// make all view template as embeded javascript (ejs)
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//mongoose/model config
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:
	   {type:Date,default:Date.now}
})
var   Blog = mongoose.model("Blog",blogSchema)

// Blog.create({
// 	title: "sampleBlog" , 
// 	image:"https://images.unsplash.com/photo-1593309377460-1de1c6cb5313?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
// 	body:"Simple pojnd with fish a lovely sinario which we cannot refuse to relax too"
// });

//  index ROUTS
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("Error");
		}else{
			res.render("index",{ blogs:blogs });
		}
	})
});
//new route
app.get("/blogs/new",function(req,res){
	res.render("new");
})
//create route
app.post("/blogs",function(req,res){
	//create
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			//redirecting to home page
			res.redirect("/blogs");
			
		}
	});
});

//show route:
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundblog});
		}
	});
});



app.get("/",function(req,res){
	res.redirect("/blogs");
});

//Edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});

//update route
app.put("/blogs/:id",function(req,res){
	// Blog.findByIdAndUpdate(id,new data, callback)
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
	{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		}
		
		
	})
});

//delete route
app.delete("/blogs/:id",function(req,res){
	//destroy blogs
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
	//redirect
});


// we do app.listen to make sure our application looks for any request form a port.
app.listen(3000,function(){
	console.log("server is running");
} );