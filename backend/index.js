const express=require('express');
const app=express();
const port=3000;

app.get('/',(req,res)=>{
    res.json({message:'Welcome to the Home Page from backend! change vayo wow'});
});

app.get('/auth/login',(req,res)=>{
    res.json({message:'Welcome to login page'});
});

app.get('/auth/contact',(req,res)=>{
    res.json({message:'Welcome to the contact page'});
});

app.get('/user',(req,res)=>{
    res.json({message:'Welcome to user'});
});

app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});