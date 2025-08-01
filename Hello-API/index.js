const express = require('express');
const server = express();


server.get("/", (req,resp)=>{
    resp.send("Welcome the Code Base ")
})

server.get('/hello', (req, resp)=>{
    resp.send("Hello Ravi")
})

server.listen(5000,()=>{
    console.log("Server Start");
    
})