function compareLowerCaseTrim(a, b) {
  return a?.toLowerCase().trim() === b?.toLowerCase().trim();
}

async function ContractsTable(parent, {
  username,
  exalted,
  filters = {},
  initialStatuses = ['unclaimed', 'in-progress', 'completed'],
  excludeStatusFilterNames = [],
  title,
} = {}) {
  Loading(parent);

  const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?path=contracts`)
  let contracts = await resp.json();

  for (let key of Object.keys(filters)) {
    contracts = contracts.filter(
      c => compareLowerCaseTrim(c[key], filters[key])
    )
  }

  const headers = [
    'Description',
    'Date Listed',
    'Owner',
    'Claimed By',
    'Payment',
    'Date Completed',
    'Actions'
  ];

  const table = document.createElement('div')
  table.setAttribute('class', 'table');
  table.style = `grid-template-columns: 1fr 6.5em 6.5em 6.5em 9em 9em 5em;`

  headers.forEach(header => table.insertAdjacentHTML('beforeend', `
    <div class="header cell">${header}</div>
  `));
  contracts.forEach(contract => ContractRow(table, {contract, initialStatuses, username, exalted}));

  const container = document.createElement('div');
  container.setAttribute('id', 'inner-main');
  if (exalted) {
    const newContractButton = document.createElement('button');
    newContractButton.textContent = 'New Contract';
    newContractButton.addEventListener('click', () => {
      window.location = 'new_contract.html';
    })
    const titleContainer = document.createElement('div');
    titleContainer.setAttribute('id', 'contracts-title-container');
    titleContainer.innerHTML = `<div class="title">${title}</div>`;
    titleContainer.appendChild(newContractButton);
    container.appendChild(titleContainer);
  } else {
    container.innerHTML = `<div class="title">${title}</div>`;
  }

  StatusFilter(container, {initialStatuses, excludeStatusFilterNames});
  container.appendChild(table);

  parent.innerHTML = '';
  parent.appendChild(container);
}
