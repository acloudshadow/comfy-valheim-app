class ContractCounts extends Component {
  constructor() {
    super();
    this.wrapper.setAttribute('id', 'inner-main');
    this.wrapper.innerHTML = '<div class="title">Contract Count Summary</div>';

    this.table = document.createElement('div');
    this.table.setAttribute('class', 'table');
    this.table.style = `grid-template-columns: repeat(8, 1fr);`;
    this.table.insertAdjacentHTML(
      'beforeend',
      `
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
    `,
    );
    this.wrapper.appendChild(this.table);
    this.rows = {};
  }

  update(parent, { allCounts }) {
    this.updateCollection(
      this.rows,
      allCounts,
      (username, counts) => new ContractCountRow(username, counts),
      (username, row) => row.render(this.table),
    );
  }
}

class ContractCountRow extends Component {
  constructor(username, counts) {
    super();
    this.wrapper.classList.add('table-row');
    this.wrapper.innerHTML = `
      <div class="cell">${username}</div>
      <div class="cell">${counts.owned.unclaimed}</div>
      <div class="cell">${counts.owned.inProgress}</div>
      <div class="cell">${counts.owned.complete}</div>
      <div class="cell">${counts.owned.completedLastTwoWeeks}</div>
      <div class="cell">${counts.claimed.inProgress}</div>
      <div class="cell">${counts.claimed.complete}</div>
      <div class="cell">${counts.claimed.completedLastTwoWeeks}</div>
    `;
  }

  update(parent, props) {}
}
