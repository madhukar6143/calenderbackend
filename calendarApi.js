const exp=require("express")
const CalenderApi=exp.Router();
const {google} = require('googleapis');
require('dotenv').config();
const axios = require('axios');
const moment=require("moment")



// Provide the required configuration
 const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
 const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar("v3");

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);


 //global variables
 let existList
 let userlist


const start = async () => 
{
try
{
    //
for (let  element of   ["codechef.com","codeforces.com","facebook.com/hackercup","codingcompetitions.withgoogle.com","hackerearth.com","icpc.global"]) 
{   


       start2(element)
       await timeout(10000);

}
}
catch(error)
{
console.log(`Error at Contacting After Start Function --> ${error}`)
}
}//async function close

const timeout = ms => new Promise(res => setTimeout(res, ms));

const start2 = async (element) =>
{
try
{
   
    var twoMonthAfter= moment().add(3, 'months')
    var todayDate= moment()
   
    twoMonthAfter=twoMonthAfter.format().slice(0,19);
    todayDate=todayDate.format().slice(0,19)
   
    userlist = await axios.get("https://clist.by/api/v2/contest/?resource="+element+"&order_by=start&username="+process.env.USER_NAME+"&api_key="+process.env.APIKEY+"&start__gte="+todayDate+"&end__lte="+twoMonthAfter+"")
    var start = new Date()
    var end = new Date();

    end.setDate(end.getDate() + 365);

        getEvents(start, end)
        .then(existList => 
        {
               Myfilter(userlist.data.objects,existList)
               .then(array3=>
                {   
                if(array3.length!=0){
                     for (let events of array3) 
                    {

                        var startTime= moment( events.start).add(330, 'minutes');
                        var endTime= moment( events.end).add(330, 'minutes');

                        startTime=startTime.format().slice(0,19)
                        endTime=endTime.format().slice(0,19)

                           //  Event for Google Calendar
                           let event =
                          {
                            'summary':events.event,
                            'description': events.href,
                            'start':
                           {
                                    'dateTime':  startTime,
                                    'timeZone': 'Asia/Kolkata'
                           },
                           'end':
                                {
                                    'dateTime':  endTime,
                                    'timeZone': 'Asia/Kolkata'
                                } 
                           }//end of event function
                           


                             // insertevent  to Calender
                        insertEvent(event)
                             .then((res) => {   if(res==1)  {console.log("successfully inserted in calender")} else{console.log("error occured while inserting")}})
                            .catch((err) => {console.log(err)})
                        }
                    }
                }
                )//close of myfilter then 
                .catch((err) =>{console.log("error while filtering",err.message)})
            

        }     
        )//close of get events then 
        .catch((err) =>{console.log(err)})//get events promise catch block

    
    }
catch(error)
{
console.log(`Error at Contacting --> ${error}`)
}
}//async function close



// Insert new event to Google Calendar
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};



//filter array based on past events
const Myfilter = async (array1,array2) => {
    try{
            let array3 = await array1.filter(entry1 => !array2.some(entry2 => entry1.event === entry2.summary));
             return array3
       }
      catch(error){
            console.log(`Error at Array filtering --> ${error}`)  
             return 0;
    }
};



// Get all the events between two dates
const getEvents = async (dateTimeStart, dateTimeEnd) => {
    try {
        let response = await calendar.events.list({
            auth: auth,
            calendarId: calendarId,
            timeMin: dateTimeStart,
            timeMax: dateTimeEnd,
            timeZone: 'Asia/Kolkata'
           
        });
        let items =  response['data']['items'];
        return items;
    } catch (error) {
        console.log(`Error at getEvents  --> ${error}`);
        return 0;
    }
};







    start(); 
   







module.exports=CalenderApi;

