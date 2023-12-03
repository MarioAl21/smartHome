document.addEventListener('DOMContentLoaded', function () {

// All subsystem that we want to add is from this class
class Subsystem {
  constructor(name) {
    this.name = name;
    this.state = 'on';
  }

  setState(newState) {
    this.state = newState;
    console.log(`${this.name} is now ${this.state}.`);
  }
}

// Hub to add and display systems 
class SmartHomeHub {
  constructor() {
    this.subsystem = {};
  }

  addSubsystem(subsystemName, subsystem) {
    this.subsystem[subsystemName] = subsystem;
    console.log(subsystem);
  }

  controlSubsystem(subsystemName, status) {
    const sub = this.subsystem[subsystemName];

    if (sub) {
      sub.setState(status);
      updateUI(); // Update the UI with the new subsystem states
    } else {
      console.log(`System ${subsystemName} not found.`);
    }
  }
}

// Instantiate the SmartHomeHub and lights
const smartHub = new SmartHomeHub();
const lightsSystem = new Subsystem('Light Control System');
const emotionsSystem = new Subsystem('Emotion Control System');

// Add lights to the hub
smartHub.addSubsystem('Light Control System', lightsSystem);
smartHub.addSubsystem('Emotion Control System', emotionsSystem);

// Function to update the UI
function updateUI() {
  const subsystemContainer = document.getElementById('systemsContainer');
  subsystemContainer.innerHTML = '';

  Object.values(smartHub.subsystem).forEach(system => {
    const subsystemDiv = document.createElement('div');
    subsystemDiv.className = 'subsystem-control';
    subsystemDiv.innerHTML = `
      <h2>${system.name}</h2>
      <p>State: ${system.state}</p>
      <button><a href="lights.html">Go to system manager</a></button>
    `;
    subsystemContainer.appendChild(subsystemDiv);
  });
}

// Function to control systems
function controlSubsystem(subsystemName, status) {
  smartHub.controlSubsystem (subsystemName, status);
}

// Initial UI update
updateUI();
});