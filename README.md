# AWS IoT Button Project - Simple Check-In/Check-Out for Hotels and AirBnB

## This Project

A simple way to check-in, check-out or ask for help with the click of a button for guests staying at hotels or AirBnB.

In this project, you will set an AWS IoT Button, using AWS cloud services, to send customized notifications using SMS text messages by a guest to the owner of a hotel or AirBnB host. 

The button supports three actions- 
  A single click will notify the guest has checked in with the time of check-in. 
  A double click will notify the guest has checked out with time of check-out.
  A long press of the button will send a distress notification that the guest needs help, with the time at which help was requested.

The AWS architecture for this project is as follows-

![Architecture](https://github.com/deskaran/aws-iot-button-checkin/blob/master/IoT-Button-SMS-Architecture.png)


The AWS IoT Button connects over wi-fi to the AWS IoT service. An AWS IoT rule triggers a Lambda function that hosts the logic for intercepting button clicks and invoking an SNS topic to send a text message to the registered phone number.

## Before We Start

You will need the following before we begin-

- An Amazon Web Services (AWS) Account. [Sign up here](https://aws.amazon.com/account/) if you do not have one.
- AWS IoT Button. [Buy it on Amazon](https://www.amazon.com/dp/B01KW6YCIM)

## Set Up Your Button

Download the AWS IoT Button app. [IoS - App Store](https://itunes.apple.com/us/app/aws-iot-button/id1178216626?mt=8) or [Android - Google Play](https://play.google.com/store/apps/details?id=com.amazonaws.iotbutton&hl=en)

Sign in to the app using your AWS account credentials.

Follow the instructions on the app to register, configure and set up your button.

![Screenshot 1](https://github.com/deskaran/aws-iot-button-checkin/blob/master/app-screenshot-1.jpeg)

On the "Set button action" page, select "Send SMS (nodejs)" and enter the phone number where you would like to receive text messages (SMS).

![Screenshot 2](https://github.com/deskaran/aws-iot-button-checkin/blob/master/app-screenshot-2.jpeg)

## Modify your Lambda function

The button set up process creates a Lambda function on your AWS account that is triggered by click of your IoT button and invokes Amazon SNS to send the notification text messages.

Log in to your AWS Console and from the **Services** menu, select *Lambda*. You should find a newly created Lambda function named *"iotbutton_XXX"* where XXX is your device code (DNS). If you do not see the function, make sure you are in the same AWS region where the button was registered.

Under the **Code** tab, delete all existing code and replace it with the code provided here: [iot-button-lambda.js](https://github.com/deskaran/aws-iot-button-checkin/blob/master/iot_button_lambda.js)

Make sure you replace "const PHONE_NUMBER = '1-999-999-9999';" with the phone number that you want to use to receive SMS notifications.

Save your changes.

## Start clicking!

Click your IoT button and test it works as expected.

Clicking once will send a check-in message that looks like this-

`CHECK-IN ALERT! Guest in Room 1 has checked in at 22:37:04 PST`

Clicking twice will send a check-out message that reads like this-

`CHECK-OUT ALERT! Guest in Room 1 has checked out at 09:22:35 PST`

Long pressing the button (longer than 2 seconds) will send a distress message that reads like this-

`HELP ALERT! Guest in Room 1 needs help! Help requested at 23:18:24 PST`
