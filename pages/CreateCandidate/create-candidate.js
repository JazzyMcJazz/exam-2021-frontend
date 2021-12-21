export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/CreateCandidate/create-candidate.html')
    .then((Response) => Response.text())
    .then((candidatesHtml) => {
      content.innerHTML = candidatesHtml;
      run();
    });
};

function run() {
  addFormEventListener();
}

function addFormEventListener() {
  const form = document.querySelector('form');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendPostRequest();
  });
}

function sendPostRequest() {
  const name = document.querySelector('input.name');
  const partyId = document.querySelector('input.party-id');

  fetch(`${window.apiUrl}/api/candidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.value,
      party_id: partyId.value,
    }),
  })
    .then((Response) => Response.json())
    .then((response) => {
      if (response.error) {
        displayMessage(response.message, 'error');
      } else {
        displayMessage(
          `${name.value} is now a candidate. Congratulations!`,
          'success'
        );
        name.value = '';
        partyId.value = '';
      }
    });
}

function displayMessage(message, type) {
  const messageP = document.querySelector('.message');
  messageP.setAttribute('class', `message ${type}`);
  messageP.innerHTML = message;
}
