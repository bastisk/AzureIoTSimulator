## Prerequisties

Your machine needs to be able to connect to the internet without the company proxy
If your machine does not support this use the remote destop connection

## Installation

Install Node.JS on your machine.
Install all dependencies using the following command.

```
npm install
```

## Running
Either use start.bat or run this in bash
node demosender.js

## Usage
Before running, please edit demosender.js.
Enter the needed information for these four parameters:

```
var appid = 'x';
var deviceid = 'y';
var productid = 'z';
var key = 'key';
```

You can get this information in IoT Platform Portal by navigating to a device and taking a look at the "Properties tab".
If the developer information is not shown there, navigate to the devicetype(product) of the device you want to connect. Click on the product and check "Enable Developer Mode".
Now the information needed should be shown in the devices properties tab.