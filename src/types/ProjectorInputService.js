'use strict';

const inherits = require('util').inherits;

module.exports = {
  registerWith: function (hap) {

    const Characteristic = hap.Characteristic;
    const Service = hap.Service;

    ////////////////////////////////////////////////////////////////////////////
    // TOP Input Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.TopInput = function () {
      Characteristic.call(this, 'Top Input', Characteristic.InputHDMI1.UUID);

      const props = {
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
      };

      this.setProps(props);
      this.value = this.getDefaultValue();
    };
    Characteristic.InputHDMI1.UUID = '97C11EAC-68A6-45FA-9C6B-7B01F84CA6A2';
    inherits(Characteristic.InputHDMI1, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // BOTTOM Input Characteristic
    ////////////////////////////////////////////////////////////////////////////
    Characteristic.BottomInput = function () {
      Characteristic.call(this, 'Bottom Input', Characteristic.InputHDMI2.UUID);

      const props = {
        format: Characteristic.Formats.BOOL,
        perms: [Characteristic.Perms.READ, Characteristic.Perms.WRITE, Characteristic.Perms.NOTIFY],
      };

      this.setProps(props);
      this.value = this.getDefaultValue();
    };
    Characteristic.InputHDMI2.UUID = '97BFCDF3-8E4A-4C00-BFEF-87C2AC531E95';
    inherits(Characteristic.InputHDMI2, Characteristic);

    ////////////////////////////////////////////////////////////////////////////
    // Projector Input Service
    ////////////////////////////////////////////////////////////////////////////
    Service.ProjectorInputService = function (displayName, subtype) {
      Service.call(this, displayName, Service.ProjectorInputService.UUID, subtype);

      this.addOptionalCharacteristic(Characteristic.Name);

      // Required Characteristics
      this.addCharacteristic(Characteristic.TopInput);
      this.addCharacteristic(Characteristic.BottomInput);
    };

    Service.ProjectorInputService.UUID = 'A80636B7-59DB-4BC3-BF44-47F23523B86C';
    inherits(Service.ProjectorInputService, Service);
  }
};