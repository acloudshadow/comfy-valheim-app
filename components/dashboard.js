function Dashboard(parent, {username}) {
  const main = document.createElement('div')
  main.innerHTML = 'Loading...'

  const allContracts = document.createElement('div');
  allContracts.textContent = 'All Contracts';
  allContracts.addEventListener('click', () => ContractsTable(main, {username}));

  const ownedContracts = document.createElement('div');
  ownedContracts.textContent = 'My Owned Contracts';
  ownedContracts.addEventListener('click', () => ContractsTable(
    main, {username, filters: {owner: username}}));

  const claimedContracts = document.createElement('div');
  claimedContracts.textContent = 'My Claimed Contracts';
  claimedContracts.addEventListener('click', () => ContractsTable(
    main, {username, filters: {claimedBy: username}}));

  const header = document.createElement('div');
  header.style = "width: 10em; flex-grow: 0; flex-shrink: 0";
  header.appendChild(allContracts);
  header.appendChild(ownedContracts);
  header.appendChild(claimedContracts);

  parent.innerHTML = '';
  parent.appendChild(header)
  parent.appendChild(main);
  ContractsTable(main, {username})
}
