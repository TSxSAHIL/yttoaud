const express = require("express")
const getaudio = require("./getaudio")
const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
res.send("hi")
})

app.post("/audio",getaudio)

app.listen("2000",console.log("server started"))