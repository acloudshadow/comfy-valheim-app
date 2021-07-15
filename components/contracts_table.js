function compareLowerCaseTrim(a, b) {
  return a?.toLowerCase().trim() === b?.toLowerCase().trim();
}

async function ContractsTable(parent, {username, exalted, filters = {}} = {}) {
  Loading(parent);

  const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?fn=getAllContracts`)
  let contracts = await resp.json();

  for (let key of Object.keys(filters)) {
    contracts = contracts.filter(
      c => compareLowerCaseTrim(c[key], filters[key])
    )
  }

  const headers = ['Description', 'Date Listed', 'Owner', 'Claimed By', 'Payment', 'Date Completed', 'Actions'];
  const table = document.createElement('div')
  table.style = `
      display:grid;
      grid-template-columns: repeat(${headers.length}, 1fr);
      grid-template-rows: repeat(auto-fill, auto)
  `
  headers.forEach(header => table.insertAdjacentHTML('beforeend', `<div>${header}</div>`));
  contracts.forEach(c => {
      [
        c.what,
        c.dateListed,
        c.owner,
        c.claimedBy,
        c.payment,
        c.dateCompleted,
      ].forEach(value => table.insertAdjacentHTML('beforeend', `<div>${value}</div>`))

      const actions = document.createElement('div');
      if (!c.claimedBy && compareLowerCaseTrim(c.owner, username)) {
        const deleteAction = document.createElement('button');
        deleteAction.textContent = 'Delete';
        deleteAction.addEventListener('click', () => {
          console.log('would delete contract', c.rowNum);
        });
        actions.appendChild(deleteAction);
        if (c.claimedBy) {
          const completeAction = document.createElement('button');
          completeAction.textContent = 'Complete';
          completeAction.addEventListener('click', () => {
            console.log('would complete contract', c.rowNum);
          });
          actions.appendChild(completeAction);
        }
      }
      if (!c.dateCompleted && compareLowerCaseTrim(c.claimedBy, username)) {
        const unclaimAction = document.createElement('button');
        unclaimAction.textContent = 'Unclaim';
        unclaimAction.addEventListener('click', () => {
          console.log('would unclaim contract', c.rowNum);
        });
        actions.appendChild(unclaimAction);
      }
      if (!c.claimedBy && !exalted) {
        const claimAction = document.createElement('button');
        claimAction.textContent = 'Claim';
        claimAction.addEventListener('click', () => {
          console.log('would claim contract', c.rowNum);
        });
        actions.appendChild(claimAction);
      }
      table.appendChild(actions);
    }
  );

  parent.innerHTML = '';
  parent.appendChild(table);
}
