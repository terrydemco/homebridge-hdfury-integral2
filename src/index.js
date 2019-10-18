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
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  HOMEBRIDGE.homebridge = homebridge;

  homebridge.registerAccessory("homebridge-hdfury-integral2-rs232", "Integral2", mySwitch)
};


function mySwitch(log, config) {
  debug = log;
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
	timeout: function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	},
	updatePowerState: async function() {
  	const powerState = await this._device.execute('#get input');
	this.log(`Powerstate = ${powerState}`);
	
	let state;
	if (powerState.includes('top')) {
		state = true;
	} else {
		state = false;
	}
	this.switchService
        .getCharacteristic(Characteristic.On)
        .updateValue(state);
        return state;
  	},
	
	getSwitchOnCharacteristic: async function (callback) {	
	const powerState = await this._device.execute('#get input');
	this.log(`Powerstate = ${powerState}`);
	
	let state;
	if (powerState.includes('top')) {
		state = true;
	} else {
		state = false;
	}
	this.log(`getSwitchCharacteristic returning: ${state}`);
	return callback(null, state);
	},
	setSwitchOnCharacteristic: async function (on, next) {
	
	    this.log(`Set Integral2 top input source to ${on}`);
    try {
      const value = on === true ? 'top' : 'bot';
      this.log(`setting value::${value}`);
      const cmd = `#set input ${value} \r`;

      this.log(`Sending ${cmd}`);
      await this._device.execute(cmd);
      //await this.timeout(2000);
      //this.updatePowerState();
    

    }
    catch (e) {
      this.log(`Failed to set characteristic ${e}`);
      next(e);
    }
    return next();
  }
	
}

