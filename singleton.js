class SmartHomeHub {
  constructor() {
    if (!SmartHomeHub.instance) {
      this.lights = {};
      SmartHomeHub.instance = this;
    }

    return SmartHomeHub.instance;
  }

  addLight(lightName, light) {
    this.lights[lightName] = light;
  }

  controlLight(lightName, action) {
    const light = this.lights[lightName];

    if (light) {
      // Control the light based on the action (e.g., turn on, turn off)
      console.log(`Controlling ${lightName}: ${action}`);
      light.setState(action);
    } else {
      console.log(`Light ${lightName} not found.`);
    }
  }
}

class Light {
  constructor(name) {
    this.name = name;
    this.state = 'off';
  }

  setState(newState) {
    this.state = newState;
    console.log(`${this.name} is now ${this.state}.`);
  }
}

// Example usage:

const hub1 = new SmartHomeHub();
const hub2 = new SmartHomeHub();

console.log(hub1 === hub2); // Both instances refer to the same object

const livingRoomLight = new Light('Living Room Light');
const kitchenLight = new Light('Kitchen Light');

hub1.addLight('LivingRoomLight', livingRoomLight);
hub2.addLight('KitchenLight', kitchenLight);

hub1.controlLight('LivingRoomLight', 'Turn On');
hub2.controlLight('KitchenLight', 'Turn Off');
