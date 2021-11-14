const express=require("express")
const router=express.Router()
const Categories=require("../../models/Categories")
const post=require("../../models/Post")
const path=require("path")

router.get("/",(req,res)=>{
    res.render("admin/index")
})

router.get("/categories",(req,res)=>{
    Categories.find({}).sort({$natural:-1}).then(categories=>{
        res.render("admin/categories",{categories:categories})
    })
})

router.post("/categories",(req,res)=>{
    Categories.create(req.body,(error,category)=>{
        if(error){
            console.log(error)
        } else {
            res.redirect("categories")
        }
    })
})

router.get("/posts",(req,res)=>{
    post.find({}).populate({path:"categories",model:Categories}).sort({$natural:-1}).then(posts=>{
            res.render("admin/posts",{posts:posts})
    })
})

router.delete("/categories/:id",(req,res)=>{
    Categories.remove({_id:req.params.id}).then(()=>{
        res.redirect("/admin/categories")
    })
})

router.delete("/posts/:id",(req,res)=>{
    post.remove({_id:req.params.id}).then(()=>{
        res.redirect("/admin/posts")
    })
})


router.get("/posts/edit/:id",(req,res)=>{
    post.findOne({_id:req.params.id}).then(post=>{
        Categories.find({}).then(categories=>{
            res.render("admin/editpost",{post:post,categories:categories})
        })
    })
})

router.put("/posts/:id",(req,res)=>{
    let post_image=req.files.post_image
    post_image.mv(path.resolve(__dirname,"../../public/img/post_images",post_image.name))
    post.findOne({_id:req.params.id}).then(post=>{
        Categories.find({}).then(categories=>{
            post.title=req.body.title
            post.content=req.body.content
            post.date=req.body.date
            post.categories=req.body.categories
            post.post_image="/img/post_images/"+post_image.name

            post.save().then(post=>{
                res.redirect("/admin/posts")
            })
        })
    })
})
module.exports=router
