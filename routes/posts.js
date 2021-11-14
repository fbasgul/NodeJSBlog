const express = require("express")
const router = express.Router()
const Post = require("../models/Post")
const User = require("../models/User")
const path = require("path")
const Category = require("../models/Categories")
const Categories = require("../models/Categories")

router.get("/new", (req, res) => {
    if (!req.session.userid) {
        res.redirect("/users/login")
    }

    Category.find({}).then(categories => {
        res.render("site/addpost", { categories: categories })
    })

})

router.post("/test", (req, res) => {
    let post_image = req.files.post_image

    post_image.mv(path.resolve(__dirname, "../public/img/post_images", post_image.name))
    Post.create({
        ...req.body,
        post_image: "/img/post_images/" + post_image.name,
        author: req.session.userid
    })
    req.session.sessionFlash = {
        type: "alert alert-success",
        message: "Yazınız başırılı bir şekilde eklendi"
    }
    res.redirect("/blog")
})

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

router.get("/search", function(req, res) {
    if (req.query.look) {
       const regex = new RegExp(escapeRegex(req.query.look), 'gi');
       Post.find({ "content": regex }).populate({ path: "author", model: User }).sort({ $natural: -1 }).then(posts => {
        Category.aggregate([{
            $lookup: {
                from: "posts", //posttaki tablo
                localField: "_id", //categorideki id
                foreignField: "categories",  //posttaki data adı
                as: "posts"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                post_sayisi: { $size: "$posts" }
            }
        }
        ]).then(categories => {
            res.render("site/blog",({posts:posts,categories:categories}))
       })  })
    }
})

router.get("/category/:categoryid", (req, res) => {
    Post.find({ categories: req.params.categoryid }).populate({path: "categories", model: Categories}).populate({path: "author", model: User}).then(posts => {
        Category.aggregate([{
            $lookup: {
                from: "posts", //posttaki tablo
                localField: "_id", //categorideki id
                foreignField: "categories",  //posttaki data adı
                as: "posts"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                post_sayisi: { $size: "$posts" }
            }
        }
        ]).then(categories => {
            res.render("site/blog",({posts:posts,categories:categories}))
        })
    })
})

router.get("/:id", (req, res) => {
    Post.findById(req.params.id).populate({ path: 'author', model: User }).then(post => {
        Category.aggregate([{
            $lookup: {
                from: "posts", //posttaki tablo
                localField: "_id", //categorideki id
                foreignField: "categories",  //posttaki data adı
                as: "posts"
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                post_sayisi: { $size: "$posts" }
            }
        }
        ]).then(categories => {
            Post.find({}).populate({ path: "author", model: User }).sort({ $natural: -1 }).then(posts => {
                res.render("site/post", { post: post, categories: categories, posts: posts })
            })
        })
    })
})

module.exports = router

/* router.get("/:id",(req,res)=>{
    Post.findById(req.params.id).populate({path:'author',model:User}).then(post=>{
        Category.find({}).then(categories=>{
            Post.find({}).populate({path:"author",model:User}).sort({$natural:-1}).then(posts=>{
                res.render("site/post",{post:post,categories:categories,posts:posts})
            })
        })
    })
}) tek kayıt bilgisini getirir*/