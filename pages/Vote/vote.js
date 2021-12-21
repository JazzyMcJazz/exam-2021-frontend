export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/CandidateList/candidate-list.html')
    .then((Response) => Response.text())
    .then((voteHtml) => {
      content.innerHTML = voteHtml;
      run();
    });
};

async function run() {
  const candidates = await fetchCandidates();
  const orderedList = orderList(candidates, 'id', -1);
  renderCandidates(orderedList);
  addSortingEventlisteners(orderedList);
  addVotingFunctionality(orderedList);
}

function renderCandidates(candidates) {
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = getHtml(candidates);
}

function getHtml(candidates) {
  let html = '';

  candidates.forEach((candidate) => {
    html += `
              <tr>
                  <td class="td-name-${candidate.id}">${candidate.name}</td>
                  <td>${candidate.party.name}</td>
                  <td class="td-id-${candidate.id}">${candidate.party.id}</td>
                  <td><button class="vote-btn-${candidate.id}">VOTE</button></td>
              </tr>`;
  });

  return html;
}

async function fetchCandidates() {
  return await fetch(`${window.apiUrl}/api/candidate`)
    .then((Response) => Response.json())
    .then((candidateData) => {
      console.log(candidateData);
      return candidateData;
    });
}

function addSortingEventlisteners(candidates) {
  const orderName = document.querySelector('.order-by-name');
  const orderParty = document.querySelector('.order-by-party');
  const orderId = document.querySelector('.order-by-id');

  let nameOrder = -1,
    partyOrder = -1,
    idOrder = -1;
  let nameColumn = 'name',
    partyColumn = 'party',
    idColumn = 'id';

  orderName.addEventListener('click', () => {
    nameOrder = sortByName(candidates, nameColumn, nameOrder);
    partyOrder = -1;
    idOrder = -1;
  });

  orderParty.addEventListener('click', () => {
    partyOrder = sortByName(candidates, partyColumn, partyOrder);
    nameOrder = -1;
    idOrder = -1;
  });

  orderId.addEventListener('click', () => {
    idOrder = sortByName(candidates, idColumn, idOrder);
    nameOrder = -1;
    partyOrder = -1;
  });
}

function sortByName(candidates, column, order) {
  const ordered = orderList(candidates, column, order);

  renderCandidates(ordered);
  return -order;
}

function orderList(list, column, order) {
  return list.sort((a, b) => {
    let sortA;
    let sortB;
    if (column == 'name') {
      sortA = a.name;
      sortB = b.name;
    } else if (column == 'party') {
      sortA = a.party.name;
      sortB = b.party.name;
    } else if (column == 'id') {
      sortA = a.party.id;
      sortB = b.party.id;
    }

    if (sortA < sortB) return order;
    if (sortA > sortB) return -order;
    return 0;
  });
}

function addVotingFunctionality(candidates) {
  candidates.forEach((candidate) => {
    const voteBtn = document.querySelector(`.vote-btn-${candidate.id}`);
    voteBtn.addEventListener('click', () => submitVote(candidate.id));
  });
}

function submitVote(id) {
  fetch(`${window.apiUrl}/api/candidate/vote/${id}`, { method: 'PUT' });
}
