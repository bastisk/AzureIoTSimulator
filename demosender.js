var Protocol = require('azure-iot-device-amqp').Amqp;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

var connectionString = 'HostName=<any>;DeviceId=<any>;SharedAccessKey=<any>';
var client = Client.fromConnectionString(connectionString, Protocol);
var pressure = 1000;


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
      var message = new Message('pressure: ' + pressure);
      console.log('Sending message: ' + message.getData());
      client.sendEvent(message, printResultFor('send'));
      pressure= preasure - 100;
      if(preasure == 0) preasure = 1000;
    }, 1000);

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