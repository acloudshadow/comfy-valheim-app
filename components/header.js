let activeHeaderMenuItem;

function HeaderMenuItem(parent, {id, textContent, onClick}) {
    const item = document.createElement('div');
    item.setAttribute('id', id);
    item.classList.add('header-menu-item');
    if (id === activeHeaderMenuItem) {
      item.classList.add('active');
    }
    item.textContent = textContent;
    item.addEventListener('click', (ev) => {
      if (id !== activeHeaderMenuItem) {
        if (activeHeaderMenuItem) {
          document.getElementById(activeHeaderMenuItem).classList.remove('active');
        }
        activeHeaderMenuItem = id;
        item.classList.add('active');
      }
      onClick?.(ev);
    });

    parent.appendChild(item)
}

function Header(parent, {username}) {
  const header = document.createElement('div');
  header.setAttribute('id', 'header');
  header.insertAdjacentHTML('beforeend', `
    <div style="display: flex; align-items: center;  margin: 1em 0">
      <div style="width: 30%; flex-grow: 0; flex-shrink: 0; padding-right: 0.5em; padding-left: 1em;">
        <img style="width: 100%; border-radius: 100%;" src='assets/icon.jpg'/>
      </div>
      <div style="text-align:center;">Comfy<br/>Valheim</div>
    </div>
  `)

  HeaderMenuItem(header, {
    id: 'all-contracts',
    textContent: 'All Contracts',
    onClick: () => ContractsTable(main, {
      username,
      initialStatuses: ['unclaimed'],
      title: "All Contracts",
    }),
  });

  HeaderMenuItem(header, {
    id: 'my-owned-contracts',
    textContent: 'My Owned Contracts',
    onClick: () => ContractsTable(main, {
      username,
      filters: {owner: username},
      title: "My Owned Contracts",
    }),
  });

  HeaderMenuItem(header, {
    id: 'my-claimed-contracts',
    textContent: 'My Claimed Contracts',
    onClick: () => ContractsTable(main, {
      username,
      filters: {claimedBy: username},
      excludeStatusFilterNames: ['Unclaimed'],
      title: "My Claimed Contracts",
    }),
  });

  HeaderMenuItem(header, {
    id: 'contract-counts',
    textContent: 'Contract Counts',
    onClick: () => ContractCounts(main),
  });

  parent.innerHTML = '';
  parent.appendChild(header);
}
