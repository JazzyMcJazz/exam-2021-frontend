// Written by Lars and Periklis

export default () => {
  const header = document.querySelector('.header');

  return fetch('./components/navbar/navbar.html')
    .then((Response) => Response.text())
    .then((navbarHtml) => {
      header.innerHTML = navbarHtml;
      renderNavbar();
    });
};

function renderNavbar() {
  const navOptions = document.querySelector('.nav-options');

  navOptions.innerHTML = `
        <div class="flex">
            <div>
                <a href="" class="election-nav nav-option" data-navigo>Election Results</a>
            </div>
            <div>
                <a href="" class="candidates-nav nav-option" data-navigo>Candidates</a>
            </div>
            <div>
              <a href="" class="vote-nav nav-option" data-navigo>Vote!</a>
            </div>
            <div>
                <a href="" class="new-candidate-nav nav-option" data-navigo>New Candidate</a>
            </div>
         </div>`;

  const election = document.querySelector('.election-nav');
  const candidates = document.querySelector('.candidates-nav');
  const vote = document.querySelector('.vote-nav');
  const newCandidate = document.querySelector('.new-candidate-nav');
  election.setAttribute('href', '/election-results');
  candidates.setAttribute('href', '/candidates');
  vote.setAttribute('href', '/vote');
  newCandidate.setAttribute('href', '/new-candidate');
}
