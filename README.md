# homebridge-hdfury-integral2

A homebridge plugin reworked to control HDFury Integral2 via RS-232.
In development, not currently working

## Status

[![HitCount](http://hits.dwyl.io/grover/homebridge-epson-projector-rs232.svg)](https://github.com/grover/homebridge-epson-projector-rs232)
[![Build Status](https://travis-ci.org/grover/homebridge-epson-projector-rs232.png?branch=master)](https://travis-ci.org/grover/homebridge-epson-projector-rs232)
[![Node version](https://img.shields.io/node/v/homebridge-epson-projector-rs232.svg?style=flat)](http://nodejs.org/download/)
[![NPM Version](https://badge.fury.io/js/homebridge-epson-projector-rs232.svg?style=flat)](https://npmjs.org/package/homebridge-epson-projector-rs232)


## Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 ```sudo npm install -g terrydemco/homebridge-epson-projector-rs232 --unsafe-perm```

### Configuration

```json
{
  "bridge": {
      ...
  },
  "platforms": [
    {
      "platform": "Integral2",
      "devices": [
        {
          "name": "Integral2",
          "port": "/dev/serial0",
          "pollingInterval": 60000
        }
      ]
    }
  ]
}
```

The configuration of a projector consists of the platform name, a list of devices, the name of the projector and the port it 
is connected to. The polling interval regulates how often the plugin should query the projector for the current status. Note that
the default value is 60000 milliseconds. You can go as low as 1000 milliseconds if you require faster status updates in HomeKit. The projector will be polled with this frequency at all times, when it's powered on and powered off.

## Hardware setup

Unfortunately I'm not a hardware expert on setting this up. I've found the following configuration to work for me on a Raspberry Pi Zero W, however be aware that you might break stuff if electrons flow in unexpected amounts and directions. Also please be careful when working with electricity and electrical circuits. I will in no way take responsibility for your actions.

You need a serial cable to connect the projector to a computer or a Raspberry Pi. A USB powered serial adapter might work for you, I've good experience with (real) FTDI chips.

If you're creating your own solution for this, it is recommended that you use a MAX3232 IC to connect the projector with the Raspberry Pi for proper circuit protection to both devices.

### Disable serial TTY on RPi

On a Raspberry Pi you additionally need to:

- Disable the login shell on the serial port
- Keep the serial port hardware enabled

If you run homebridge, the user account running homebridge must be a member of the dialout group.

## Supported clients

This platform and the switches it creates have been verified to work with the following apps on iOS 11:

* Home (only the Power switch is available in the Home app, all other services are `Not supported`.)
* Elgato Eve


## License

MIT License

Copyright (c) 2017 Michael Fröhlich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


