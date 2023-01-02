const exp=require("express")
const app=exp();
const path=require("path")
const axios = require('axios');
require("dotenv").config()
const moment=require("moment")



const UserApi=require("./APIS/user-api");
const calenderApi=require("./calendarApi")
//redirect based on path

app.use("/user",UserApi)


app.use('/presentcontest/:name',async(req,res)=>{
    try{
    let contestName=req.params.name
    var todayDate= moment()
    todayDate=todayDate.format().slice(0,16)
   
    let userlist= await axios.get("https://clist.by/api/v2/contest/?resource="+contestName+"&order_by=start&username="+process.env.USER_NAME+"&api_key="+process.env.APIKEY+"&start__gte="+todayDate+"");
     
    res.send(userlist.data.objects)
    }
    catch (error) {
        console.log(`Error at Contacting contacting server --> ${error}`);
        return 0;
    }  
}
)


app.use('/pastcontest/:name',async(req,res)=>{
    try{
    let contestName=req.params.name
    console.log("contestName",contestName);

    var oneMonthAgo = moment().subtract(1, 'months');
    var todayDate= moment()
   
   oneMonthAgo=oneMonthAgo.format().slice(0,19);
   todayDate=todayDate.format().slice(0,19)
   
  
   
    let userlist= await axios.get("https://clist.by/api/v2/contest/?resource="+contestName+"&order_by=-start&username="+process.env.USER_NAME+"&api_key="+process.env.APIKEY+"&start__gte="+oneMonthAgo+"&end__lte="+todayDate+"");
     console.log("data",userlist.data.objects)
    res.send(userlist.data.objects)
    }
    catch (error) {
        console.log(`Error at Contacting contacting server --> ${error}`);
        return 0;
    }  
}
)

const port=process.env.PORT || 8080;
app.listen(port,()=>console.log(`server working on ${port}...`))