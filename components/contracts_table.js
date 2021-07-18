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
  table.setAttribute('id', 'contracts-table');
  table.style = `
      display:grid;
      grid-template-columns: 1fr 6.5em 6.5em 6.5em 9em 9em 5em;
      grid-template-rows: repeat(auto-fill, auto)
  `
  headers.forEach(header => table.insertAdjacentHTML('beforeend', `
    <div class="header cell">${header}</div>
  `));
  contracts.forEach(contract => ContractRow(table, {contract, initialStatuses, username, exalted}));

  const container = document.createElement('div');
  container.setAttribute('id', 'contracts-container');
  container.innerHTML = `<div class="title">${title}</div>`;
  StatusFilter(container, {initialStatuses, excludeStatusFilterNames});
  container.appendChild(table);

  parent.innerHTML = '';
  parent.appendChild(container);
}
