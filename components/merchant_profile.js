function MerchantProfile(parent, merchant) {
  const container = document.createElement('div');
  container.setAttribute('id', 'inner-main');
  parent.innerHTML = '';
  parent.appendChild(container);

  container.innerHTML = `
    <div class='title'>${merchant.username}</div>
    <div class="merchant-profile-summary-text">
      Total Completed Contracts: ${merchant.numCompletedContracts}
    </div>
  `

  numCompletedContractsByOwner = {}
  merchant.completedContracts.forEach((contract) => {
    if (numCompletedContractsByOwner[contract.owner] == undefined) {
      numCompletedContractsByOwner[contract.owner] = 0;
    }
    numCompletedContractsByOwner[contract.owner]++;
  })

  const idk = document.createElement('div')
  idk.setAttribute('class', 'merchant-profile-summary-text');
  idk.innerHTML = 'By Contract Owner: |';

  Object.entries(numCompletedContractsByOwner).sort((a, b) => a[1] < b[1]).forEach(
    ([owner, num]) => {
      idk.insertAdjacentHTML('beforeend', ` ${owner}: ${num} |`);
  })
  container.appendChild(idk)
  container.insertAdjacentHTML('beforeend', '<div class="merchant-profile-summary-text"/>')
  const headers = [
    'Description',
    'Date Listed',
    'Owner',
    'Claimed By',
    'Payment',
    'Date Completed',
  ];

  const table = document.createElement('div')
  table.setAttribute('class', 'table');
  table.style = `grid-template-columns: 1fr 6.5em 6.5em 6.5em 9em 9em;`
  headers.forEach(header => table.insertAdjacentHTML('beforeend', `
    <div class="header cell">${header}</div>
  `));

  merchant.completedContracts.forEach((contract) => {
      let dateListed = formatDate(contract.dateListed);
      let dateCompleted = formatDate(contract.dateCompleted);

      [
        contract.what,
        dateListed,
        contract.owner,
        contract.claimedBy,
        contract.payment,
        dateCompleted,
      ].forEach((value) => table.insertAdjacentHTML('beforeend',
          `<div class="cell">${value ? value : '-'}</div>`))
  })

  container.appendChild(table);
}
