'use strict';

const version = require('../package.json').version;



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
  this.log(`log-> ${log}  - $ ${config}`);

}

mySwitch.prototype = {

	getServices: function() {
		 let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "My switch manufacturer")
      .setCharacteristic(Characteristic.Model, "My switch model")
      .setCharacteristic(Characteristic.SerialNumber, "123-456-789");

    let switchService = new Service.Switch("My switch");
    switchService
      .getCharacteristic(Characteristic.On);
      //.on('get', this.getSwitchOnCharacteristic.bind(this))
      //.on('set', this.setSwitchOnCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
	},
	
	getSwitchOnCharacteristic: function (next) {
	},
	setSwitchOnCharacteristic: function (on, next) {
	}


}
