'use strict';

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // TOP Input Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.Switch = function () {
      Characteristic.call(this, 'Switch', Characteristic.Switch.UUID);

      const props = {
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
      };

      this.setProps(props);
      this.value = this.getDefaultValue();
    };
    Characteristic.Switch.UUID = '97C11EAC-68A6-45FA-9C6B-7B01F84CA6A2';
    inherits(Characteristic.Switch, Characteristic);


    ////////////////////////////////////////////////////////////////////////////
    // Projector Input Service
    ////////////////////////////////////////////////////////////////////////////
    Service.ProjectorInputService = function (displayName, subtype) {
      Service.call(this, displayName, Service.ProjectorInputService.UUID, subtype);

      this.addOptionalCharacteristic(Characteristic.Name);

      // Required Characteristics
      this.addCharacteristic(Characteristic.Switch);
    };

    Service.ProjectorInputService.UUID = 'A80636B7-59DB-4BC3-BF44-47F23523B86C';
    inherits(Service.ProjectorInputService, Service);
  }
};