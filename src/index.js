'use strict';

const version = require('../package.json').version;

const ProjectorAccessory = require('./ProjectorAccessory');

const ProjectorInputServiceTypes = require('./types/ProjectorInputService');

const HOMEBRIDGE = {
  Accessory: null,
  Service: null,
  Characteristic: null,
  UUIDGen: null
};

const platformName = 'homebridge-hdfury-integral2-rs232';
const platformPrettyName = 'Integral2';

module.exports = (homebridge) => {
  //HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  //HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;
  //HOMEBRIDGE.homebridge = homebridge;

  //homebridge.registerPlatform(platformName, platformPrettyName, EpsonProjectorPlatform, false);
  homebridge.registerAccessory("homebridge-hdfury-integral2-rs232", "Integral2", mySwitch)

  //ProjectorInputServiceTypes.registerWith(homebridge.hap);
};

function mySwitch(log, config) {
  this.log = log;
  this.getUrl = url.parse(config['getUrl']);
  this.postUrl = url.parse(config['postUrl']);
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
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
    return [informationService, switchService];
	}
	
	getSwitchOnCharacteristic: function (next) {
	}
	setSwitchOnCharacteristic: function (on, next) {
	}


}
const EpsonProjectorPlatform = class {
  constructor(log, config, api) {
    this.log = log;
    this.log(`HDFury Integral2 Platform Plugin Loaded - Version ${version}`);
    this.config = config;
    this.api = api;

    this.api.on('didFinishLaunching', this._didFinishLaunching.bind(this));
  }

  _didFinishLaunching() {
  }

  accessories(callback) {
    this._accessories = [];

    this.config.devices.forEach(device => {
      this._accessories.push(new ProjectorAccessory(this.api, this.log, device));
    });

    callback(this._accessories);
  }
};