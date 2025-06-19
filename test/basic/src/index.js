import nestedJson from 'nested/1/2/3/test.mjs';
import virtualJsonList from 'virtual-json-list';

window.test = virtualJsonList;
window.nestedJson = nestedJson;

const preElement =
  document.getElementById('test') || document.createElement('pre');
preElement.id = 'test';

preElement.innerHTML = JSON.stringify(virtualJsonList, null, 2);

document.body.appendChild(preElement);

module.hot?.accept();
