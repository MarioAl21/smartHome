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
  // Removes a light by name and its corresponding observer
  removeLight(lightName) {
      delete this.lights[lightName];
      this.removeObserver(lightName);
      this.notifyObservers(); // Notify observers after removing the light
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
    this.observedLights = [];
  }

  removeLightObserver(lightName) {
    const index = this.observedLights.indexOf(lightName);
    if (index !== -1) {
      this.observedLights.splice(index, 1);
    }
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
        <i class="lightBulbImage ${light.state === 'ON' ? 'fas' : 'far'} fa-lightbulb"></i>
        <input type="range" class="brightnessControl" min="0" max="100" step="1" value="${light.brightness}">
        <p>Brightness: <span class="brightnessValue">${light.brightness}</span></p>
        <h2>${light.name}</h2>
        <p>State: ${light.state}</p>
        <button class="turnLights">Turn On/Off</button>
        <button class="removeLight">Remove Light</button>
      `;
      this.app.appendChild(lightDiv);

      // Event listener for turning lights on/off
      const turnLightsButton = lightDiv.querySelector('.turnLights');
      turnLightsButton.addEventListener('click', () => {
        const newState = light.state === 'ON' ? 'OFF' : 'ON';
        light.setState(newState);
    
        // Enable or disable the brightness control based on the state
        const brightnessControl = lightDiv.querySelector('.brightnessControl');
        console.log(`Current state: ${newState}`);
        console.log(brightnessControl.value);
    
        if (brightnessControl) {
          setTimeout(() => {  // Introduce a slight delay
            if (newState === 'OFF') {
              brightnessControl.disabled = true;
              console.log(brightnessControl);
            } else {
              brightnessControl.removeAttribute('disabled');
              console.log(brightnessControl);
            }
          }, 100);  // You can adjust the delay time as needed
        } else {
          console.error('Brightness control element not found.');
        }
      });

      // Event listener for brightness control
      const brightnessControl = lightDiv.querySelector('.brightnessControl');
      brightnessControl.addEventListener('input', (event) => {
          const newBrightness = event.target.value;
          light.setBrightness(newBrightness);

          // Update the displayed brightness value
          const brightnessValue = lightDiv.querySelector('.brightnessValue');
          brightnessValue.textContent = newBrightness;
      })
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
   this.brightness = 0;
  }

  setState(newState) {
   this.state = newState;
  }

  // New method to set brightness
  setBrightness(newBrightness) {
    this.brightness = newBrightness;
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
      const lightName = event.target.parentNode.querySelector('h2').textContent;
      state = state ^ true;
      let action = 'ON';
      if(!state)
       action = 'OFF';
      smartHub.controlLights(lightName, action);
  }
});

// remove lights
lightsContainer.addEventListener('click', (event) => {
if (event.target.classList.contains('removeLight')) {
  const lightName = event.target.parentNode.querySelector('h2').textContent;

  // Ask for confirmation before removing the light
  const confirmation = window.confirm(`Are you sure you want to remove the light "${lightName}"?`);

  if(confirmation) {
   smartHub.removeLight(lightName);
   uiObserver.removeLightObserver(lightName);
   uiObserver.manualRender();
  }
  else {
    console.log("Operation canceled");
  }
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

  if (smartHub.lights[newLightName]) {
    alert(`The light name "${newLightName}" is already taken. Please choose a unique name.`);
    return; // Stop the function if the name is not unique
  }

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

// Lights Control Modes
const lightsControlModes = document.getElementById('lightsControlModes');
lightsControlModes.addEventListener('click', (event) => {
  if (event.target.id === 'applyLightMode') {
    applyLightControlMode();
  }
});

function applyLightControlMode() {
  const selectedMode = document.querySelector('input[name="lightMode"]:checked');

  if (selectedMode) {
    const modeValue = selectedMode.value;
    // Apply the selected mode (implement your logic here)
    alert(`Lights Control Mode - Selected Mode: ${modeValue}`);
  } else {
    alert('Please select a mode.');
  }
}


// Manually render the UI
uiObserver.manualRender();


