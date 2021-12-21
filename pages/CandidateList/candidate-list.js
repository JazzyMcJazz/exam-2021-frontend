export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/CandidateList/candidate-list.html')
    .then((Response) => Response.text())
    .then((candidatesHtml) => {
      content.innerHTML = candidatesHtml;
      run();
    });
};

async function run() {
  const candidates = await fetchCandidates();
  const orderedList = orderList(candidates, 'id', -1);
  renderCandidates(orderedList);
  addSortingEventlisteners(orderedList);
  addEditFunctionality(orderedList);
  addDeleteFunctionality(orderedList);
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
                <td><button class="edit-btn-${candidate.id}">Edit</button></td>
                <td><button class="delete-btn-${candidate.id}">Delete</button></td>
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

function addEditFunctionality(candidates) {
  candidates.forEach((candidate) => {
    const editBtn = document.querySelector(`.edit-btn-${candidate.id}`);
    editBtn.addEventListener('click', () => changeToInputFields(candidate));
  });
}

function changeToInputFields(candidate) {
  const nameCell = document.querySelector(`.td-name-${candidate.id}`);
  const idCell = document.querySelector(`.td-id-${candidate.id}`);

  nameCell.innerHTML = `<form class="form-${candidate.id}"><input class="input-name-${candidate.id}" class="" value="${candidate.name}"></input></form>`;
  idCell.innerHTML = `<form class="form-${candidate.id}"><input class="input-id-${candidate.id}" value="${candidate.party.id}"></input></form>`;

  const forms = document.querySelectorAll(`.form-${candidate.id}`);
  forms.forEach((form) =>
    form.addEventListener('submit', () => submitEdit(candidate.id))
  );
}

function submitEdit(id) {
  const nameInput = document.querySelector(`.input-name-${id}`);
  const idInput = document.querySelector(`.input-id-${id}`);

  fetch(`${window.apiUrl}/api/candidate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      name: nameInput.value,
      party_id: idInput.value,
    }),
  })
    .then((Response) => Response.json())
    .then((response) => {
      console.log(response);
      if (!response.error) {
        run();
      }
    });
}

function addDeleteFunctionality(candidates) {
  candidates.forEach((candidate) => {
    const deleteBtn = document.querySelector(`.delete-btn-${candidate.id}`);
    deleteBtn.addEventListener('click', () => submitDelete(candidate.id));
  });
}

function submitDelete(id) {
  fetch(`${window.apiUrl}/api/candidate/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (response.status == 204) {
      run();
    }
  });
}
