// Ensures that only one instance of the Hub is created
class LightsHub {
    // Singleton implementation
    constructor() {
        if(!LightsHub.instance) {
            this.lights = {}; // Object to store the lights (value pair: light name is the key and its value is the Light instance)
            this.observers = []; // Array to keep track of observers that want to be notified of changes
            LightsHub.instance = this;
        }

        return LightsHub.instance;
    }

    // Adds a new light to the lights object and notifies observers
    addLight(light_name, light) {
        this.lights[light_name] = light;
        this.notifyObservers();
    }

    // Controls the state of a light. It finds the light by name and sets its state, then notifies observers
    controlLights(light_name, state) {
        const light = this.lights[light_name];

        if (light) {
            light.setState(state);
            this.notifyObservers();
        } else 
            console.log(`Light ${lightName} not found.`);
    }

    // Adds an observer to the list of obsevers
    addObserver(observer) {
        this.observers.push(observer);
    }

    // Removes an observer from the list of observers
    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    // Notifies all registered observers about the changes in the lights
    notifyObservers() {
        this.observers.forEach(observer => observer.update(this.lights));
    }
};

// Observer pattern for UI updates
// observes changes in the LightsHub and updates the UI accordingly.
class UIObserver {
    constructor() {
      this.app = document.getElementById('lightsContainer'); // The container in the HTML where the lights will be rendered
    }

    // Called when the LightsHub notifies observers. It updates the UI with the latest lights.
    update(lights) {
      this.renderLights(lights);
    }

    // Renders the lights in the UI based on the provided lights object.
    renderLights(lights) {
      this.app.innerHTML = '';

      Object.values(lights).forEach(light => {
        const lightDiv = document.createElement('div');
        lightDiv.className = 'light-control';
        lightDiv.innerHTML = `
          <h2>${light.name}</h2>
          <p>State: ${light.state}</p>
          <button class="turnLights">Turn On/Off</button>
        `;
        this.app.appendChild(lightDiv);
      });
    }

    // Manually triggers rendering of the UI with the current lights in the SmartHomeHub.
    manualRender() {
      this.renderLights(smartHub.lights);
    }
}

// Represents an individual light in the smart home
class Light {
    constructor(name) {
     this.name = name;
     this.state = 'OFF';
    }

    setState(newState) {
     this.state = newState;
     console.log(`${this.name} is now ${this.state}.`);
    }
}


// Invocations
// Instantiate the SmartHomeHub and UIObserver
const smartHub = new LightsHub();
const uiObserver = new UIObserver();

// Add the UI observer to the hub
smartHub.addObserver(uiObserver);

// Instantiate lights
const livingRoomLight = new Light('Living Room Light');
const kitchenLight = new Light('Kitchen Light');

// Add lights to the hub
smartHub.addLight('Living Room Light', livingRoomLight);
smartHub.addLight('Kitchen Light', kitchenLight);

// Trigger a control action
const lightsContainer = document.getElementById('lightsContainer');

let state = false;
lightsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('turnLights')) {
        //console.log(event.target);
        const lightName = event.target.parentNode.querySelector('h2').textContent;
        state = state ^ true;
        let action = 'ON';
        if(!state)
         action = 'OFF';
        smartHub.controlLights(lightName, action);
    }
});

// Add an event listener for the "Add Light" button
const addLightButton = document.getElementById('addLightButton');
addLightButton.addEventListener('click', addNewLight);

 // Function to add a new light
 function addNewLight() {
    const lightNameInput = document.getElementById('lightName');
    const initialStateSelect = document.getElementById('initialState');

    const newLightName = lightNameInput.value.trim();
    const newLightState = initialStateSelect.value;

    if (newLightName && newLightState) {
      const newLight = new Light(newLightName);
      newLight.setState(newLightState);
      
      // Add the new light to the hub
      smartHub.addLight(newLightName, newLight);

      // Clear the form fields
      lightNameInput.value = '';
      initialStateSelect.value = 'OFF';

      // Update the UI
      uiObserver.manualRender();
    } else {
      alert('Please enter a valid light name and initial state.');
    }
  }

// Manually render the UI
uiObserver.manualRender();


