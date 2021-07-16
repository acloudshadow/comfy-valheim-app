async function ContractCounts(parent) {
  Loading(parent);

  const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?fn=getContractCounts`)
  let contractCounts = await resp.json();

  const table = document.createElement('div')
  table.setAttribute('id', 'contracts-table');
  table.style = `
      display:grid;
      grid-template-columns: repeat(8, 1fr);
      grid-template-rows: repeat(auto-fill, auto)

  `
  table.insertAdjacentHTML('beforeend', `
    <div class="header cell" style="
      grid-row-end: span 2;border-right: solid 1px gray; display: flex; align-items: center;
      justify-content: center;
    ">User</div>
    <div class="header cell" style="
      grid-column-end: span 4; text-align: center; border-right: solid 1px gray; border-bottom: none;
    ">Owned By User</div>
    <div class="header cell" style="
      grid-column-end: span 3; text-align: center; border-bottom: none"
    >Claimed By User</div>
    <div class="header cell">Unclaimed</div>
    <div class="header cell">In Progress</div>
    <div class="header cell">Completed</div>
    <div class="header cell" style="border-right: solid 1px gray;">Completed Last 2 Weeks</div>
    <div class="header cell">In Progress</div>
    <div class="header cell">Completed</div>
    <div class="header cell">Completed Last 2 Weeks</div>
  `)

  for (let [user, counts] of Object.entries(contractCounts)) {
    table.insertAdjacentHTML('beforeend', `
      <div class="cell">${user}</div>
      <div class="cell">${counts.owned.unclaimed}</div>
      <div class="cell">${counts.owned.inProgress}</div>
      <div class="cell">${counts.owned.complete}</div>
      <div class="cell">${counts.owned.completedLastTwoWeeks}</div>
      <div class="cell">${counts.claimed.inProgress}</div>
      <div class="cell">${counts.claimed.complete}</div>
      <div class="cell">${counts.claimed.completedLastTwoWeeks}</div>
    `)
  }

  const container = document.createElement('div');
  container.setAttribute('id', 'contracts-container');
  container.innerHTML = '<div class="title">Contract Count Summary</div>';
  container.appendChild(table);

  parent.innerHTML = '';
  parent.appendChild(container);
}