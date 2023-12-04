document.addEventListener('DOMContentLoaded', function () {
  // Singleton pattern for SmartHomeHub
  class SmartHomeHub {
    constructor() {
      if (!SmartHomeHub.instance) {
        this.lights = {};
        this.observers = [];
        SmartHomeHub.instance = this;
      }

      return SmartHomeHub.instance;
    }

    addLight(lightName, light) {
      this.lights[lightName] = light;
      this.notifyObservers();
    }

    controlLight(lightName, action) {
      const light = this.lights[lightName];

      if (light) {
        light.setState(action);
        this.notifyObservers();
      } else {
        console.log(`Light ${lightName} not found.`);
      }
    }

    addObserver(observer) {
      this.observers.push(observer);
    }

    removeObserver(observer) {
      this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
      this.observers.forEach(observer => observer.update(this.lights));
    }
  }

  // Observer pattern for UI updates
  class UIObserver {
    constructor() {
      this.app = document.getElementById('lightsContainer');
      this.id = 0;
    }

    update(lights) {
      this.renderLights(lights);
    }

    renderLights(lights) {
      this.app.innerHTML = '';

      Object.values(lights).forEach(light => {
        this.id += 1;
        const lightDiv = document.createElement('div');
        lightDiv.className = 'light-control';
        lightDiv.innerHTML = `
          <h2>${light.name}</h2>
          <p id='state${this.id}'>State: ${light.state}</p>
          <button class="turnLights">Turn On/Off</button>
        `;
        this.app.appendChild(lightDiv);
      });
    }

    manualRender() {
      this.renderLights(smartHub.lights);
    }
   }


   // Light class
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

  // Instantiate the SmartHomeHub and lights
  const smartHub = new SmartHomeHub();
  const uiObserver = new UIObserver();

  // Add the UI observer to the hub
  smartHub.addObserver(uiObserver);

  // Instantiate lights
  const livingRoomLight = new Light('Living Room Light');
  const kitchenLight = new Light('Kitchen Light');

  // Add lights to the hub
  smartHub.addLight('Living Room Light', livingRoomLight);
  smartHub.addLight('Kitchen Light', kitchenLight);

  /* Function to control a light */
  function controlLight(lightName, state) {
    smartHub.controlLight(lightName, state);
    uiObserver.manualRender(); // Update the UI after controlling the light
    console.log(lightName);
  }

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
      initialStateSelect.value = 'Turn On';

      // Update the UI
      uiObserver.manualRender();
    } else {
      alert('Please enter a valid light name and initial state.');
    }// Add an event listener for the button click
  const turnLightButton = document.querySelectorAll('.turnLights');
    addLightButton.addEventListener('click', addNewLight);
  
    turnLightButton.forEach((attack) => {
      attack.addEventListener("click", (e) => {
      alert("sdfsdfsdf");
    });
 });
  }
  const addLightButton = document.getElementById('addLightButton');
  const turnLightButton = document.querySelectorAll('.turnLights');
  // Add an event listener for the button click
  addLightButton.addEventListener('click', addNewLight);

  const turnLightButtons = document.querySelectorAll('.turnLights');

  console.log(turnLightButtons);

  turnLightButtons.forEach(turnLightButton => {
   turnLightButton.addEventListener("click", (e) => {
    // Get the light name from the parent element
    const lightName = e.target.parentNode.querySelector('h2').textContent;
    alert(lightName);
    let state = "ON";
    state = state === "ON" ? "ON" : "OFF";
    //alert(lightName);
    // Call the controlLight function with the lightName
    controlLight(lightName, state);
   });
  });
  
});
