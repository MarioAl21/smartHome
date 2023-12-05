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

        console.log(this.lights[light_name]);

        if (light instanceof Light) {
          light.setState(state);
          smartHub.notifyObservers(); // Notify observers after controlling the light
        } else {
          console.log(`Light ${light_name} not found or is not an instance of Light.`);
        }
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

    removeLight(lightName) {
      delete this.lights[lightName];
      this.notifyObservers();
    }

    display() { console.log(this.lights); }
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
          <button class="removeLight">Remove Light</button>
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

     // Custom serialization method
    toJSON() {
     return { name: this.name, state: this.state };
    }

    // Custom deserialization method
    static fromJSON(data) {
     const light = new Light(data.name);
     light.setState(data.state);
     console.log(light);
     return light;
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

      // Save lights to localStorage
      saveLightsToStorage();

      // Clear the form fields
      lightNameInput.value = '';
      initialStateSelect.value = 'OFF';

      // Update the UI
      uiObserver.manualRender();
    } else {
      alert('Please enter a valid light name and initial state.');
    }
  }

// Function to save lights to localStorage
function saveLightsToStorage() {
  const serializedLights = JSON.stringify(Object.values(smartHub.lights).map(light => light.toJSON()));
  localStorage.setItem('lights', serializedLights);
}

// Function to retrieve lights from localStorage
function getLightsFromStorage() {
  const lightsData = localStorage.getItem('lights');
  if (lightsData) {
    try {
      const lightsArray = JSON.parse(lightsData);
      if (Array.isArray(lightsArray)) {
        return lightsArray.map(lightData => Light.fromJSON(lightData));
      } else {
        console.error('Invalid data structure in localStorage for lights.');
        return [];
      }
    } catch (error) {
      console.error('Error parsing lights data from localStorage:', error);
      return [];
    }
  } else {
    return [];
  }
}



  // Load lights from localStorage when the page loads
  smartHub.lights = getLightsFromStorage();
  uiObserver.manualRender();

  // Add an event listener for the "Add Light" button
  const addLightButton = document.getElementById('addLightButton');
  addLightButton.addEventListener('click', addNewLight);

  // Remove light
  const removeLightButtons = document.querySelectorAll('.removeLight');
  removeLightButtons.forEach(removeLightButton => {
    removeLightButton.addEventListener('click', function () {
      // Get the light name from the parent element
      const lightName = this.parentNode.querySelector('h2').textContent;

      // Remove the light from the hub
      smartHub.removeLight(lightName);

      // Save updated lights to localStorage
      saveLightsToStorage();

      // Update the UI
      uiObserver.manualRender();
    });
  });

  // Trigger a control action
const lightsContainer = document.getElementById('lightsContainer');

let state = false;
lightsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('turnLights')) {
        //console.log(event.target);
        const lightName = event.target.parentNode.querySelector('h2').textContent;
        // Remove the light from the hub
        smartHub.removeLight(lightName);
        state = state ^ true;
        let action = 'ON';
        if(!state)
         action = 'OFF';
        smartHub.controlLights(lightName, action);
    }
});

// Manually render the UI
uiObserver.manualRender();


