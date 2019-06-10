const socket = io();

socket.on('message', (message) => {
  console.log(message)
})

const $messageForm = document.querySelector('#messageForm');
const $messageInput = $messageForm.querySelector('#messageInput');
const $messageFormButton = $messageForm.querySelector('#send');
const $sendLocationButton = document.querySelector('#sendLocation');

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageInput.value = '';
    $messageInput.focus();

    if (error) {
      return console.log(error);
    }

    console.log('Message delivered.');
  });
})

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  $sendLocationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = {
      latitude,
      longitude
    }
    socket.emit('sendLocation', location, () => {
      $sendLocationButton.removeAttribute('disabled');
      console.log('Location shared.');
    });
  })
})