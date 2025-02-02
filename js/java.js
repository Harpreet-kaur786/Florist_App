
  function redirectToMap(selectElement) {
    const selectedLocation = selectElement.value;
    if (selectedLocation) {
      const mapURL = `https://www.google.com/maps/search/${encodeURIComponent(selectedLocation)}`;
      window.open(mapURL, "_blank");
    }
  }


  window.addEventListener('load', function () {
    const ringtone = document.getElementById('love-ringtone');
  
    // Attempt to play the audio
    ringtone.play().catch((error) => {
      console.log('Autoplay blocked. Enabling user interaction:', error);
  
      // Create a button for user to play the audio
      const playButton = document.createElement('button');
      playButton.innerText = 'Play Ringtone';
      playButton.style.cssText = `
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #FF6F61;
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;
  
      document.querySelector('.audio-container').appendChild(playButton);
  
      // Play audio when button is clicked
      playButton.addEventListener('click', () => {
        ringtone.play();
        playButton.remove(); // Remove the button after playing
      });
    });
  });
  
