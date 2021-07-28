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
    this.main = new Main({ username, exalted });
    this.header = new Header(Object.values(headerMenuItemProps));
  }

  update(parent, { pathParts }) {
    let activeHeaderItemId = pathParts[0];
    if (activeHeaderItemId === undefined || activeHeaderItemId === 'index.html') {
      activeHeaderItemId = 'all-contracts';
    }
    if (!headerMenuItemProps[activeHeaderItemId]) {
      return NotFound(document.body);
    }
    this.header.render(parent, { activeHeaderItemId });
    this.main.render(parent, { pathParts });
  }
}

class Main extends Component {
  constructor({ username, exalted }) {
    super();
    this.wrapper.setAttribute('id', 'main');
    this.contractsTable = new ContractsTable({ username, exalted });
    this.merchantsList = new MerchantsList();
    this.contractCounts = new ContractCounts();
    this.loadingComponent = new Loading();
    this.state.loading = true;
    this.state.username = username;
    this.fetchData();
  }

  async fetchData() {
    this.setState({ loading: true });
    const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?path=batch/merchants-and-contracts`);
    const data = await resp.json();
    const merchantsByUsername = data.merchants;
    const contracts = data.contracts;
    let merchants = Object.values(merchantsByUsername);
    merchants = merchants.filter(merchant => merchant.username != null);
    merchants = merchants.sort(
      (a, b) => (a.username > b.username ? 1 : a.username < b.username ? -1 : 0),
    );
    const counts = calculateCounts(contracts);
    this.setState({ merchantsByUsername, merchants, contracts, counts, loading: false });
  }

  async update(parent, { pathParts } = {}) {
    if (this.state.loading) {
      this.loadingComponent.render(this.wrapper);
      return;
    } else {
      this.loadingComponent.remove();
    }

    this.wrapper.innerHTML = '';

    switch (pathParts.length) {
      case 0:
      case 1:
        switch (pathParts[0]) {
          case undefined:
          case 'index.html':
          case 'all-contracts':
            this.contractsTable.render(this.wrapper, {
              contracts: this.state.contracts,
              initialStatuses: ['unclaimed'],
              title: 'All Contracts',
            });
            break;
          case 'my-owned-contracts':
            this.contractsTable.render(this.wrapper, {
              contracts: this.state.contracts,
              filters: { owner: this.state.username },
              title: 'My Owned Contracts',
            });
            break;
          case 'my-claimed-contracts':
            this.contractsTable.render(this.wrapper, {
              contracts: this.state.contracts,
              filters: { claimedBy: this.state.username },
              excludeStatusFilterNames: ['Unclaimed'],
              title: 'My Claimed Contracts',
            });
            break;
          case 'contract-counts':
            this.contractCounts.render(this.wrapper, {allCounts: this.state.counts});
            break;
          case 'merchants':
            this.merchantsList.render(this.wrapper, { merchants: this.state.merchants });
            break;
          default:
            NotFound(document.body);
            break;
        }
        break;
      case 2:
        if (pathParts[0] === 'merchants') {
          const merchant = this.state.merchants.find(
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

function calculateCounts(contracts) {
  let counts = {};

  function initCounts(username) {
    counts[username] = {
      owned: {
        unclaimed: 0,
        inProgress: 0,
        complete: 0,
        completedLastTwoWeeks: 0,
      },
      claimed: {
        inProgress: 0,
        complete: 0,
        completedLastTwoWeeks: 0,
      },
    };
  }

  const startDate = moveToCutoff(getDateOfSecondPreviousWeekday(0));
  const dummyClaimedCounts = {
    unclaimed: 0,
    inProgress: 0,
    complete: 0,
    completedLastTwoWeeks: 0,
  };

  contracts.forEach(contract => {
    if (!(contract.owner.toLowerCase() in counts)) {
      initCounts(contract.owner.toLowerCase());
    }
    const ownedCounts = counts[contract.owner.toLowerCase()].owned;

    if (contract.claimedBy && !(contract.claimedBy.toLowerCase() in counts)) {
      initCounts(contract.claimedBy.toLowerCase());
    }
    const claimedCounts = contract.claimedBy
      ? counts[contract.claimedBy.toLowerCase()].claimed
      : dummyClaimedCounts;

    const status = contract.dateCompleted
      ? 'complete'
      : contract.claimedBy
        ? 'inProgress'
        : 'unclaimed';
    ownedCounts[status]++;
    claimedCounts[status]++;

    if (contract.dateCompleted && new Date(contract.dateCompleted) > startDate) {
      ownedCounts.completedLastTwoWeeks++;
      claimedCounts.completedLastTwoWeeks++;
    }
  });
  return counts;
}

function getDateOfSecondPreviousWeekday(weekday) {
  const date = new Date();
  let dayDiff = date.getUTCDay() - weekday;
  if (dayDiff <= 0) {
    dayDiff += 7;
  }
  date.setUTCDate(date.getUTCDate() - dayDiff - 7);
  return date;
}

function moveToCutoff(date) {
  date.setUTCHours(6);
  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);
  return date;
}
