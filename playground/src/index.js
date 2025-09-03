import virtualJsonList from 'virtual-json-list';

window.test = virtualJsonList;

const preElement =
  document.getElementById('test') || document.createElement('pre');
preElement.id = 'test';

preElement.innerHTML = JSON.stringify(virtualJsonList, null, 2);

document.body.appendChild(preElement);

module.hot?.accept();
