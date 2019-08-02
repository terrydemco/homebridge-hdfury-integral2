'use strict';

const Transport = require('./Transport');

const ProjectorInputService = require('./ProjectorInputService');

let Characteristic, Service;

const powerRegex = /PWR=([0-9]+)/;

class ProjectorAccessory {

  constructor(api, log, config) {
    this.api = api;
    Characteristic = this.api.hap.Characteristic;
    Service = this.api.hap.Service;

    this.log = log;
    this.config = config;
    this.name = config.name;

    this.config.pollingInterval = this.config.pollingInterval || 60000;

    this._isReachable = false;
    this._device = new Transport(this.config.port, log);
    this._device.on('connected', this._onConnected.bind(this));
    this._device.on('disconnected', this._onDisconnected.bind(this));

    this._services = this.createServices();
  }

  getServices() {
    return this._services;
  }

  createServices() {
    return [
      this.getAccessoryInformationService(),
      this.getBridgingStateService(),
      //this.getProjectorInputService()
      this.getSwitchService()
    ];
  }

  getAccessoryInformationService() {
    this._accessoryInformation = new Service.AccessoryInformation();
    this._accessoryInformation
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'HDFury')
      .setCharacteristic(Characteristic.Model, 'Integral2')
      .setCharacteristic(Characteristic.SerialNumber, '')
      .setCharacteristic(Characteristic.FirmwareRevision, this.config.version)
      .setCharacteristic(Characteristic.HardwareRevision, this.config.version);

    return this._accessoryInformation;
  }

  getBridgingStateService() {
    this._bridgingService = new Service.BridgingState();

    this._bridgingService.getCharacteristic(Characteristic.Reachable)
      .updateValue(this._isReachable);
    return this._bridgingService;
  }

  getProjectorInputService() {
    this._projectorInputService = new ProjectorInputService(this.log, this.api, this._device, this.name);
    return this._projectorInputService.getService();
  }
  
  getSwitchService() {
    let switchService = new Service.Switch("My switch");
    switchService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getSwitchOnCharacteristic.bind(this))
      .on('set', this.setSwitchOnCharacteristic.bind(this));
  }
  
    getSwitchOnCharacteristic() {

  }

  setSwitchOnCharacteristic(value) {
        this.log(`Set Integral2 input source to ${value}`);
    try {
      value = value === true ? 'top' : 'bot';
      this.log(`setting value:: ${value}`);
      const cmd = `#set input ${value}`;

      this.log(`Sending ${cmd}`);
      await this._device.execute(cmd);
      callback(undefined);

      this._updateSource(this._lastKnownSource, false);
      this._lastKnownSource = value;
    }
    catch (e) {
      this.log(`Failed to set characteristic ${e}`);
      callback(e);
    }
  }
  }

  async _onConnected() {
    await this._refreshSerialNumber();
    await this._refreshProjectorStatus();

    this._setReachable(true);
  }

  async _refreshProjectorStatus() {

    try {
      const powerStatus = await this._refreshPowerStatus();

      
      if (powerStatus === '01') {

      }
    }
    catch (e) {
      // Do not leak the exception
      this.log(`Failed to refresh status: ${e}`);
    }

    // Schedule another update
    setTimeout(() => {
      this._refreshProjectorStatus();
    }, this.config.pollingInterval);
  }

  async _refreshSerialNumber() {
    //const serialNumber = await this._device.execute('SNO?');
    //this.log(`Projector serial number: ${serialNumber.constructor.name}`);
    this._accessoryInformation.setCharacteristic(Characteristic.SerialNumber, '5A2BCCC333D');
  }

  async _refreshPowerStatus() {
    const powerState = await this._device.execute('#get input');
    if (powerState === null) {
      throw new Error('Failed to process #get input response');
      return false;
    }

    return true;
  }

  _onDisconnected() {
    this._setReachable(false);
  }

  _setReachable(state) {
    this.log(`Reachable: ${state}`);
    if (this._isReachable === state) {
      return;
    }

    this._isReachable = state;

    this._bridgingService.getCharacteristic(Characteristic.Reachable)
      .updateValue(this._isReachable);
  }
}

module.exports = ProjectorAccessory;
