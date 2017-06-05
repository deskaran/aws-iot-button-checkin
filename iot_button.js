/* Lambda Function to use AWS IoT button to send check-in/check-out notifications for a AirBnB using SNS Topic.
NOTE: Remember to create an SNS Topic, and update IAM policy for the iotbutton role to allow SNS:Publish permission to the SNS ARN before proceeding. */

'use strict';
const AWS = require('aws-sdk');
const SNS = new AWS.SNS({ apiVersion: '2010-03-31' });

// !!CHANGE THIS!! Enter the ARN of your SNS Topic
const TOPIC_ARN = 'arn:aws:sns:us-west-2:278578718694:IoT-Button-CheckIn';

// !!CHANGE THIS!! Enter difference in hours between your local time and UTC.
var localTimeZone = -7;
/* Example: For PST (UTC -7), enter -7. For CET (UTC +1), enter 1. 
NOTE: Timezones with half and quarter hour offset such as IST are not supported. Enter nearest timezone with full hour offset, or enter 0 to keep it in UTC
NOTE 2.0: Do not try to enter invalid timezone values like numbers > 12, or letters. Your code will NOT work! */

exports.handler = (event, context, callback) => {
    
    // Messages for single click, double click and long click
    const singleClick = 'CHECK-IN ALERT! Guest in Room 1 has checked in at ';
    const doubleClick = 'CHECK-OUT ALERT! Guest in Room 2 has checked out at ';
    const longClick = 'HELP ALERT! Guest in Room 1 needs help! Help requested at ';
    
    console.log('Received event:', event);
    console.log(`Sending SMS to ${TOPIC_ARN}`);

    var currentTime = new Date();
    // NOTE: all Lambda functions run on UTC

    // Extracts hour, minutes, seconds to transform to local format
    var currentHour = currentTime.getHours();
    var currentMin =  currentTime.getMinutes();
    var currentSec =  currentTime.getSeconds();

    // UTC to local timezone conversion
    var localHour = 0;
    var absLocalTimeZone = 0;

    // Part 1: For timezones UTC-XX
    if (localTimeZone < 0){
        // Get absolute value of timezone difference
        absLocalTimeZone = localTimeZone * (-1);

        if(currentHour >= 0 && currentHour < absLocalTimeZone){
            localHour = currentHour + localTimeZone +24;
        }

        if(currentHour >= absLocalTimeZone && currentHour < 24){
            localHour = currentHour + localTimeZone;
        }
    }
    // Part 2: For timezones UTC+XX
    else if (localTimeZone > 0){
        if(currentHour >= 0 && currentHour < (24 - localTimeZone)){
            localHour = currentHour + localTimeZone;
        }
        if(currentHour >= (24 - localTimeZone) && currentHour < 24){
            localHour = currentHour + localTimeZone - 24;
        }
    }
    // Part 3: For UTC
    else{
        localHour = currentHour;
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
    var doorMessage = singleClick + currentLocalTime;
    
    // If button clicked twice
    if(event.clickType == "DOUBLE"){
        doorMessage = doubleClick + currentLocalTime;
    }

    // If button long pressed
    if(event.clickType == "LONG"){
        doorMessage = longClick + currentLocalTime;
    }
    
    // Send notification to all phone numbers and email IDs defined in the SNS Topic
    const params = {
        TopicArn: TOPIC_ARN,
        Message: doorMessage,
    };
    SNS.publish(params, callback);
};