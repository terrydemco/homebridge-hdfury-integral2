'use strict';

const version = require('../package.json').version;
const Transport = require('./Transport');



const HOMEBRIDGE = {
  Accessory: null,
  Service: null,
  Characteristic: null,
  UUIDGen: null
};


module.exports = (homebridge) => {
  //HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  //HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;
  HOMEBRIDGE.homebridge = homebridge;

  //homebridge.registerPlatform(platformName, platformPrettyName, EpsonProjectorPlatform, false);
  homebridge.registerAccessory("homebridge-hdfury-integral2-rs232", "Integral2", mySwitch)

  //ProjectorInputServiceTypes.registerWith(homebridge.hap);
};


function mySwitch(log, config) {
  this.log = log;
  this._device = new Transport("/dev/ttyUSB0", log);

}

mySwitch.prototype = {

	getServices: function() {
		 let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "HDFury")
      .setCharacteristic(Characteristic.Model, "Integral2")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    let switchService = new Service.Switch("HDMI Switch");
    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
	},
	
	getSwitchOnCharacteristic: async function (next) {
	this.log('getSwitchCharacteristic');
	const powerState = await this._device.execute('#get input');
	this.log(`Powerstate = ${powerState}`);
	return next();
	},
	setSwitchOnCharacteristic: async function (on, next) {
	
	    this.log(`Set Integral2 input source to ${value}`);
    try {
      value = value === true ? 'top' : 'bot';
      this.log(`setting value:: ${value}`);
      const cmd = `#set input ${value}`;

      this.log(`Sending ${cmd}`);
      await this._device.execute(cmd);

    }
    catch (e) {
      this.log(`Failed to set characteristic ${e}`);
      next(e);
    }
    return next();
  }
	
}

