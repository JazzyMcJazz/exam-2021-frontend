export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/CandidateList/candidate-list.html')
    .then((Response) => Response.text())
    .then((resultsHtml) => {
      content.innerHTML = resultsHtml;
      run();
    });
};

async function run() {
  const parties = await fetchParties();
  renderParties(parties);
}

function renderParties(parties) {
  const wrapper = document.querySelector('.table-wrapper');
  wrapper.innerHTML = getHtml(parties);
}

function getHtml(parties) {
  let html = '';

  parties.forEach((party) => {
    const votes = getTotalVotes(party);

    html += `
        <h2>${party.id} - ${party.name}</h2>
        <p>Total votes: ${votes}</p>
        <table class="candidates-table">
            <thead>
                <th>Name</th>
                <th>Votes</th>
            </thead>   
            <tbody>`;

    party.candidates.forEach((candidate) => {
      html += `
                <tr>
                    <td>${candidate.name}</td>
                    <td>${candidate.votes}</td>
                </tr>`;
    });

    html += `</tbody></table><br>`;
  });

  return html;
}

function getTotalVotes(party) {
  let votes = 0;
  party.candidates.forEach((candidate) => (votes += candidate.votes));
  return votes;
}

async function fetchParties() {
  return await fetch(`${window.apiUrl}/api/parties`)
    .then((Response) => Response.json())
    .then((candidateData) => {
      console.log(candidateData);
      return candidateData;
    });
}
