export default () => {
  const content = document.querySelector('.content');

  return fetch('./pages/main/main.html')
    .then((Response) => Response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      run();
    });
};

async function run() {}
