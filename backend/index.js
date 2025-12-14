const express=require('express');
const app=express();
const port=3000;

app.use('/api/user/'.require('./routes/router'))
app.use('/api/book/'.require('./routes/bookroute'))

app.get('/',(req,res)=>{
    res.json({message:'Welcome to the Home Page from backend! change vayo wow'});
});


app.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});