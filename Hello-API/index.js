const express = require('express');
const server = express();

// Home 
server.get("/", (req,resp)=>{
    resp.send("Welcome the Code Base ")
})

// Hello Route
server.get('/hello', (req, resp)=>{
    resp.send("Hello Ravi")
})

server.listen(5000,()=>{
    console.log("Server Start");
    
})