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

  const byOwner = {};
  merchant.completedContracts.forEach((contract) => {
    if (byOwner[contract.owner.toLowerCase()] == undefined) {
      byOwner[contract.owner.toLowerCase()] = {
        count: 0,
        usernameVariations: new Set(),
      };
    }
    byOwner[contract.owner.toLowerCase()].count++;
    byOwner[contract.owner.toLowerCase()].usernameVariations.add(contract.owner);
  })

  const idk = document.createElement('div')
  idk.setAttribute('class', 'merchant-profile-summary-text');
  idk.innerHTML = 'By Contract Owner: |';

  Object.values(byOwner).sort((a, b) => a.count < b.count).forEach(
    ({count, usernameVariations}) => {
      const username = Array.from(usernameVariations).sort((a, b) => {
        return countUpperCaseChars(a) < countUpperCaseChars(b);
      })[0]
      idk.insertAdjacentHTML('beforeend', ` ${username}: ${count} |`);
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

function countUpperCaseChars(s) {
  return s.split('').filter(c => c === c.toUpperCase()).length;
}
