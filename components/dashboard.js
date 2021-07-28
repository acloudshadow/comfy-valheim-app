const headerMenuItemProps = {
  'all-contracts': {
    id: 'all-contracts',
    textContent: 'All Contracts',
  },
  'my-owned-contracts': {
    id: 'my-owned-contracts',
    textContent: 'My Owned Contracts',
  },
  'my-claimed-contracts': {
    id: 'my-claimed-contracts',
    textContent: 'My Claimed Contracts',
  },
  'contract-counts': {
    id: 'contract-counts',
    textContent: 'Contract Counts',
  },
  merchants: {
    id: 'merchants',
    textContent: 'Merchants',
  },
};

class Dashboard extends Component {
  static wrapperType = null;

  constructor({ username, exalted }) {
    super();
    this.main = new Main();
    this.header = new Header(Object.values(headerMenuItemProps));
  }

  update(parent, { username, exalted, pathParts }) {
    let activeHeaderItemId = pathParts[0];
    if (activeHeaderItemId === undefined || activeHeaderItemId === 'index.html') {
      activeHeaderItemId = 'all-contracts';
    }
    if (!headerMenuItemProps[activeHeaderItemId]) {
      return NotFound(document.body);
    }
    this.header.render(parent, { activeHeaderItemId });
    this.main.render(parent, { username, exalted, pathParts });
  }
}

class Main extends Component {
  constructor() {
    super();
    this.wrapper.setAttribute('id', 'main');
    this.merchants = null;
  }

  async update(parent, { username, exalted, pathParts } = {}) {
    if (!this.merchants) {
      const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?path=merchants`);
      let merchants = await resp.json();
      merchants = merchants.filter(merchant => merchant.username != null);
      merchants = merchants.sort(
        (a, b) => (a.username > b.username ? 1 : a.username < b.username ? -1 : 0),
      );
      this.merchants = merchants;
    }

    switch (pathParts.length) {
      case 1:
        switch (pathParts[0]) {
          case undefined:
          case 'index.html':
          case 'all-contracts':
            ContractsTable(this.wrapper, {
              username,
              exalted,
              initialStatuses: ['unclaimed'],
              title: 'All Contracts',
            });
            break;
          case 'my-owned-contracts':
            ContractsTable(this.wrapper, {
              username,
              exalted,
              filters: { owner: username },
              title: 'My Owned Contracts',
            });
            break;
          case 'my-claimed-contracts':
            ContractsTable(this.wrapper, {
              username,
              exalted,
              filters: { claimedBy: username },
              excludeStatusFilterNames: ['Unclaimed'],
              title: 'My Claimed Contracts',
            });
            break;
          case 'contract-counts':
            ContractCounts(this.wrapper);
            break;
          case 'merchants':
            MerchantsList(this.wrapper);
            break;
          default:
            NotFound(document.body);
            break;
        }
        break;
      case 2:
        if (pathParts[0] === 'merchants') {
          const merchant = this.merchants.find(
            merchant => merchant.username === decodeURIComponent(pathParts[1]),
          );
          if (merchant) {
            MerchantProfile(this.wrapper, merchant);
            break;
          }
        }
      default:
        NotFound(document.body);
        break;
    }
  }
}
