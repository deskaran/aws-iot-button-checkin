/*
Lambda Function to use AWS IoT button to send check-in/check-out notifications for a hotel/AirBnB
2017-03-15 - github.com/deskaran
This code is being made available to use at your own risk. You are responsible for any costs incurred or damages caused by using this code (It is fairly safe and harmless, but just in case.)
*/

'use strict';

const AWS = require('aws-sdk');
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

// CHANGE THIS! Enter your phone number. Include country and area code
const PHONE_NUMBER = '1-999-999-9999'; 

exports.handler = (event, context, callback) => {
    
    // Messages for single click, double click and long click
    const singleClick = 'CHECK-IN ALERT! Guest in Room 1 has checked in at ';
    const doubleClick = 'CHECK-OUT ALERT! Guest in Room 2 has checked out at ';
    const longClick = 'HELP ALERT! Guest in Room 1 needs help! Help requested at ';
    
    console.log('Received event:', event);

    console.log(`Sending SMS to ${PHONE_NUMBER}`);

    // Gets current time in UTC
    var currentTime = new Date();
    // NOTE: Currently Lambda supports only UTC. Local time support will be added when available

    // OPTIONAL! Manually enter name of preferred timezone if different from UTC
    var localTimeZone = 'PST';

    // Extracts hour, minutes, seconds to transform to local format
    var currentHour = currentTime.getHours();
    var currentMin =  currentTime.getMinutes();
    var currentSec =  currentTime.getSeconds();

    var localHour = 0;

    // Logic to manually convert UTC to PST (UTC -7) ***CHANGE LOGIC IF USING OTHER TIMEZONES***
    if(currentHour >= 0 && currentHour <= 6){
        localHour = currentHour + 17;
    }

    if(currentHour >= 7 && currentHour <= 23){
        localHour = currentHour - 7;
    }

    // Convert minutes to 2 digits. eg: 5 to 05
    if (currentMin.toString().length == 1) {
            currentMin = "0" + currentMin;
    }

    // Convert seconds to 2 digits. eg: 5 to 05
    if (currentSec.toString().length == 1) {
            currentSec = "0" + currentSec;
    }

    // Construct time in proper format
    var currentLocalTime = localHour + ':' + currentMin + ':' + currentSec;
    
    // Default is single click
    var doorMessage = singleClick + currentLocalTime + localTimeZone;
    
    // If button clicked twice
    if(event.clickType == "DOUBLE"){
        doorMessage = doubleClick + currentLocalTime + localTimeZone;
    }

    // If button long pressed
    if(event.clickType == "LONG"){
        doorMessage = longClick + currentLocalTime + localTimeZone;
    }
    
    const params = {
        PhoneNumber: PHONE_NUMBER,
        Message: doorMessage,
    };
    // Result will go to function callback
    SNS.publish(params, callback);
};