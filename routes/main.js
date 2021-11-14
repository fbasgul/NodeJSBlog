const express=require("express")
const router=express.Router()
const post=require("../models/Post")
const Category=require("../models/Categories")
const User=require("../models/User")

router.get("/",(req,res)=>{
    console.log(req.session)
    res.render("site/index")
})

router.get("/about",(req,res)=>{
    res.render("site/about")
})

router.get("/blog",(req,res)=>{
    const postPerPage=2 //bir sayfada kaç post gözükecek
    const page=req.query.page || 1
    post.find({}).populate({path:"author",model:User}).sort({$natural:-1}).skip((postPerPage*page)-postPerPage)
    .limit(postPerPage).then(posts=>{
        post.countDocuments().then(postCount=>{
            Category.aggregate([{
                $lookup:{
                    from:"posts", //posttaki tablo
                    localField:"_id", //categorideki id
                    foreignField:"categories",  //posttaki data adı
                    as:"posts"
                        }
                    },
                    {
                    $project:{
                        _id:1,
                        name:1,
                        post_sayisi:{$size:"$posts"}
                            }
                    }
                ]).then(categories=>{
                    res.render("site/blog",{posts:posts,categories:categories,current:parseInt(page),pages:Math.ceil(postCount/postPerPage)})
            })
        })
    })
})
router.get("/contact",(req,res)=>{
    res.render("site/contact")
})

module.exports=router

        // Category.find({}).then(categories=>{
        //     res.render("site/blog",{posts:posts,categories:categories})
        // })
