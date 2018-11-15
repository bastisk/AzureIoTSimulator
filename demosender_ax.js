// Dependencies
var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var moment = require('moment');

// Parameters
var appid = 'IdOfApplicationToWhichWasConnectedTheDevice';
var deviceid = 'TheIdOfDevice';
var productid = 'TheIdOfDevicePorduct';
var key = 'TheIoTHubKey';
var sendingFrequencyInMilliseconds = 5000; //The frequency for sending of messages to IoT Hub
var connectionString = 'HostName=<hub>;DeviceId=' + deviceid + ';SharedAccessKey=' + key;


var client = Client.fromConnectionString(connectionString, Protocol);

var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
    });

    var sendInterval = setInterval(function () {
      var message = new Message(JSON.stringify(SimulateDevice()));
      console.log('Sending message: ' + message.getData());
      client.sendEvent(message, printResultFor('send'));
    }, sendingFrequencyInMilliseconds);

    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      clearInterval(sendInterval);
      client.removeAllListeners();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

function SimulateDevice(){
  var payload = {};

  // Obligatory values for every message
  payload.app_id = appid;
  payload.product_id = productid;
  payload.device_id = deviceid;
  payload.dateTime = moment(new Date());

  // Device specific sensor-values
  var whichvalue = Math.floor(Math.random() * 3 + 1);
  //Power
  if(whichvalue == 1){
    payload.type = 2;
    payload.value = Math.floor(Math.random() * 1000);
    payload.name = "Active Power Measurement (W)";
    payload.unit = 'W';
  }
  //Current
  if(whichvalue == 2){
    payload.type = 1053;
    payload.value = Math.floor(Math.random() * 800);
    payload.name = "Current RMS Measurement (mA)";
    payload.unit = 'mA';
  }
  
  //Voltage
  if(whichvalue == 3){
    payload.type = 1106;
    payload.value = Math.floor(Math.random() * 1000);
    payload.name = "Voltage RMS Measurement (V)";
    payload.unit = 'V';
  }

  return payload;
}
