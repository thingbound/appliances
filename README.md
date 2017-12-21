# Appliances

Appliances is a JavaScript library with abstract base classes for building
libraries that interact with smart appliances and devices. It helps with
mapping many common appliances to a standarized API built around the type of
appliance and its capabilities.

**DEPRECATED** Everything made available in this library is now in
[abstract-things](https://github.com/tinkerhub/abstract-things).

# Types and capabilities

Devices from different manufacturers often support different things which makes
creating a unified API hard. This library tries to solve this by both keeping
track of the type of a smart appliance, such as if its a light or a sensor,
and what actual capabilities it has, such as if it its power can be controlled
or if it can dimmed.

Any appliance should have one or more types that describes what it is. In
addition it should have capabilities that describes what it can do.

## Building appliances

In your Node project do:

```
npm install appliances
```

Creating a light that can powered on or off via some random API:

```javascript
const { Light, Switchable } = require('appliances');

class LightExample extends Light.with(Switchable) {
  constructor(externalLightApi) {
    super();

    this.externalLightApi = externalLightApi;

    // An identifier of the appliance should always be set - with a namespace
    this.id = 'light-example:' + externalLightApi.id;

    /*
     * You can update the power state at any time with updatePower. This
     * usually done either on an event or by polling the external device.
     */
    this.updatePower(externalLightApi.on);
  }

  changePower(power) {
    // Return a promise unless the power changes immediately
    return this.externalLightApi.setPower(power)
      .then(result => this.updatePower(result.on));
  }
}
```
