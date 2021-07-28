function compareLowerCaseTrim(a, b) {
  return a?.toLowerCase().trim() === b?.toLowerCase().trim();
}
class ContractsTable extends Component {
  constructor({ username, exalted }) {
    super();
    this.state = { username, exalted };
    this.wrapper.setAttribute('id', 'inner-main');
    this.contractsTitleContainer = new ContractsTitleContainer({ exalted });
    this.wrapper.appendChild(this.contractsTitleContainer.wrapper);

    this.statusFilter = new StatusFilter();
    this.wrapper.appendChild(this.statusFilter.wrapper);

    const headers = [
      'Description',
      'Date Listed',
      'Owner',
      'Claimed By',
      'Payment',
      'Date Completed',
      'Actions',
    ];

    this.table = document.createElement('div');
    this.table.setAttribute('class', 'table');
    this.table.style = `grid-template-columns: 1fr 6.5em 6.5em 6.5em 9em 9em 5em;`;

    headers.forEach(header =>
      this.table.insertAdjacentHTML(
        'beforeend',
        `
      <div class="header cell">${header}</div>
    `,
      ),
    );

    this.wrapper.appendChild(this.table);
    this.contractRows = {};
  }

  update(
    parent,
    {
      contracts,
      filters = {},
      title,
      initialStatuses = ['unclaimed', 'in-progress', 'completed'],
      excludeStatusFilterNames,
    } = {},
  ) {
    this.contractsTitleContainer.render(this.wrapper, { title });
    this.statusFilter.render(this.wrapper, { initialStatuses, excludeStatusFilterNames });

    const oldContractRowNums = Object.keys(this.contractRows);
    const newContractRowNums = contracts.map(contract => contract.rowNum);

    const removedContractRowNums = oldContractRowNums.filter(x => !newContractRowNums.includes(x));
    removedContractRowNums.forEach(rowNum => {
      this.contractRows[rowNum].remove();
      delete this.contractRows[rowNum];
    });

    const addedContractRowNums = newContractRowNums.filter(x => !oldContractRowNums.includes(x));
    addedContractRowNums.forEach(rowNum => {
      const contract = contracts.find(contract => contract.rowNum === rowNum);
      this.contractRows[rowNum] = new ContractRow({
        contract,
        username: this.state.username,
        exalted: this.state.exalted,
      });
    });

    Object.values(this.contractRows).forEach(contractRow => {
      contractRow.render(this.table, { initialStatuses, filters });
    });
  }
}

class ContractsTitleContainer extends Component {
  constructor({ exalted }) {
    super();
    this.wrapper.setAttribute('id', 'contracts-title-container');
    this.title = new ContractsTitle();
    this.wrapper.appendChild(this.title.wrapper);
    if (exalted) {
      this.newContractButton = new NewContractButton();
      this.wrapper.appendChild(this.newContractButton.wrapper);
    }
  }
  update(parent, { title }) {
    this.title.render(this.wrapper, { title });
  }
}

class ContractsTitle extends Component {
  constructor() {
    super();
    this.wrapper.classList.add('title');
  }

  update(parent, { title }) {
    this.wrapper.textContent = title;
  }
}

class NewContractButton extends Component {
  static wrapperType = 'button';

  constructor() {
    super();
    this.wrapper.textContent = 'New Contract';
    this.wrapper.addEventListener('click', () => {
      window.location = 'new_contract.html';
    });
  }

  update(parent, props) {}
}
