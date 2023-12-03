// Subject: Light
class Light {
  constructor(name) {
    this.name = name;
    this.state = 'off';
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    this.observers.forEach(observer => observer.update(this));
  }

  turnOn() {
    this.state = 'on';
    console.log(`${this.name} turned on.`);
    this.notifyObservers();
  }

  turnOff() {
    this.state = 'off';
    console.log(`${this.name} turned off.`);
    this.notifyObservers();
  }
}

// Observer: SmartHomeHub
class SmartHomeHub {
  update(light) {
    // This method is called when the state of a light changes
    console.log(`Smart Home Hub: ${light.name} is now ${light.state}.`);
    // You can add your logic here to coordinate actions based on the light state
  }
}

// Example usage:

const livingRoomLight = new Light('Living Room Light');
const kitchenLight = new Light('Kitchen Light');

const smartHub = new SmartHomeHub();

// Add the hub as an observer for both lights
livingRoomLight.addObserver(smartHub);
kitchenLight.addObserver(smartHub);

// Turn on the lights
livingRoomLight.turnOn();
kitchenLight.turnOn();

// Turn off one of the lights
livingRoomLight.turnOff();
