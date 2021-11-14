//const http=require('http')
//const fs=require("fs")
const express=require("express")
//const exphbs=require("express-handlebars") //eski versiyon
const Handlebars = require('handlebars') //yeni versiyon
const expressHandlebars = require('express-handlebars') //yeni
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access') //yeni
const fileUpload=require("express-fileupload")
const mongoose = require("mongoose")
const app=express()
const hostname="127.0.0.1"
const port=3000
const bodyParser = require("body-parser")
const {generateDate,limit,truncate,paginate}=require("./helpers/general")
const expressSession=require("express-session")
const connectmongo = require('connect-mongo')
const methodOverride = require('method-override')

app.use(fileUpload())

app.use(express.static("public"))
//app.engine("handlebars",exphbs()) //eski

app.engine('handlebars', expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{
        generateDate:generateDate,
        limit:limit,
        truncate:truncate,
        paginate:paginate
    }
})) //yeni
//app.engine("handlebars",hbs.engine)

app.set("view engine","handlebars")

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.connect("mongodb://127.0.0.1/nodeblogdb",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

const mongoStore=connectmongo(expressSession)

app.use(expressSession({
    secret:"gizlihiddenbilgi",
    resave:false,
    saveUninitialized:true,
    store: new mongoStore({mongooseConnection:mongoose.connection}) 
}))

app.use(methodOverride('_method'))

//display link middleware
app.use((req,res,next)=>{
    const userId=req.session.userid
    if (userId){
        res.locals={displayLink:true}
    } else {
        res.locals={displayLink:false}
    }
    next()
})

//flash mesaj middleware
app.use((req,res,next)=>{
    res.locals.sessionFlash=req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

const main=require("./routes/main")
const posts=require("./routes/posts")
const users=require("./routes/users")
const admin=require("./routes/admin/index")

app.use("/",main)
app.use("/posts",posts)
app.use("/users",users)
app.use("/admin",admin)



app.listen(port,hostname,()=>{
    console.log('server çalışıyor http://'+hostname+":"+port)
})