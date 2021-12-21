import renderNavbar from '../navbar/navbar.js';
import renderMain from '../../pages/main/main.js';
import renderCandidates from '../../pages/CandidateList/candidate-list.js';
import renderNewCandidate from '../../pages/CreateCandidate/create-candidate.js';
import renderVoting from '../../pages/Vote/vote.js';
import renderElectionResults from '../../pages/ElectionResults/election-results.js';

export default () => {
  const router = new Navigo('/', { hash: true });
  window.router = router;
  router
    .on({
      '/': () => {
        renderMain().then(router.updatePageLinks);
      },
      'election-results': () => {
        renderElectionResults(router.updatePageLinks);
      },
      candidates: () => {
        renderCandidates(router.updatePageLinks);
      },
      vote: () => {
        renderVoting(router.updatePageLinks);
      },
      'new-candidate': () => {
        renderNewCandidate(router.updatePageLinks);
      },
    })
    .on({
      '*': async () => {
        renderNavbar().then(router.updatePageLinks);
      },
    })
    .resolve();
};
