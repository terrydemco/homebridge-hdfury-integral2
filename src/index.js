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
  HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;
  HOMEBRIDGE.homebridge = homebridge;

  homebridge.registerPlatform(platformName, platformPrettyName, EpsonProjectorPlatform, false);


  ProjectorInputServiceTypes.registerWith(homebridge.hap);
};

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