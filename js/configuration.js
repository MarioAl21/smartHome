// Lights configuration
const lightsConfigurationForm = document.getElementById('lightsConfigurationForm');
lightsConfigurationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const room = document.getElementById('room').value;
  const mood = document.getElementById('mood').value;
  const brightness = document.getElementById('brightness').value;

  // Apply lights configuration (implement your logic here)
  alert(`Lights Configuration:\nRoom: ${room}\nMood: ${mood}\nBrightness: ${brightness}`);
});

// Sounds configuration
const soundsConfigurationForm = document.getElementById('soundsConfigurationForm');
soundsConfigurationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const roomSound = document.getElementById('roomSound').value;
  const moodSound = document.getElementById('moodSound').value;
  const soundSelection = document.getElementById('soundSelection').value;

  // Apply sounds configuration (implement your logic here)
  alert(`Sounds Configuration:\nRoom: ${roomSound}\nMood: ${moodSound}\nSound/Music: ${soundSelection}`);
});

// Recommended Routines
const recommendationForm = document.getElementById('recommendationForm');
recommendationForm.addEventListener('click', (event) => {
  if (event.target.id === 'applyRecommendationButton') {
    applyRecommendedRoutine();
  }
});

function applyRecommendedRoutine() {
  const selectedRoutine = document.getElementById('recommendedRoutine').value;
  alert(`Here we go with the routine: ${selectedRoutine} today!`);
  // Apply the selected routine (implement your logic here)
  console.log(`Recommended Routine - Selected Routine: ${selectedRoutine}`);
}