'use strict';

let Characteristic;

class ProjectorInputService {
  constructor(log, api, device, name) {

    this.log = log;
    this._device = device;
    this._sourceRegex = /SOURCE=([0-9A-Fa-f]+)/;

    Characteristic = api.hap.Characteristic;

    this._characteristics = [
      { source: 'TopInput', characteristic: Characteristic.Switch }
    ];
    this._service = new api.hap.Service.ProjectorInputService(name);
    for (let c of this._characteristics) {
      this._service
        .getCharacteristic(c.characteristic)
        .on('set', this._changeInput.bind(this, c));
    }
  }

  getService() {
    this.log('getting service');
    return this._service;
  }

  async update() {
  	this.log('projector async update');
    const status = await this._device.execute('#get input');
    this.log(`received input ${status}`);
    //const matches = this._sourceRegex.exec(status);
    if (status === 'input top' || status === 'input bot') {
      
		const source = status;
      if (source !== this._lastKnownSource) {
        this._updateSource(this._lastKnownSource, false);
        if (source === 'input top' || source === 'top') this._updateSource('TopInput', true);
        else if (source === 'input bot' || source === 'bot') this._updateSource('TopInput', false);

        this._lastKnownSource = source;
      }
    }
    else {
      this.log(`Failed to refresh characteristic state: #get input => ${status}`);
    }
  }

  _updateSource(source, state) {
  this.log('updateSource');
    const c = this._characteristics.find(c => c.source === source);
    if (c) {
      this._service
        .getCharacteristic(c.characteristic)
        .updateValue(state);
    }
  }

  async _changeInput(c, value, callback) {
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

module.exports = ProjectorInputService;
