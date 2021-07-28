class MerchantsList extends Component {
  constructor() {
    super();
    this.wrapper.setAttribute('id', 'inner-main');
    this.wrapper.innerHTML = `<div class='title'>Merchants</div>`;

    this.table = document.createElement('div');
    this.table.setAttribute('class', 'table');
    this.table.setAttribute('id', 'merchants-table');
    this.table.style = `grid-template-columns: auto`;
    this.table.innerHTML = "<div class='header cell'>Name</div>";
    this.wrapper.appendChild(this.table);
    this.merchantRows = {};
  }

  update(parent, { merchants }) {
    const oldMerchantUsernames = Object.keys(this.merchantRows);
    const newMerchantUsernames = merchants.map(x => x.username);
    const removedMerchantUsernames = oldMerchantUsernames.filter(
      x => !newMerchantUsernames.includes(x),
    );
    removedMerchantUsernames.forEach(x => {
      this.merchantRows[username].remove();
      delete this.merchantRows[username];
    });

    const addedMerchantUsernames = newMerchantUsernames.filter(
      x => !oldMerchantUsernames.includes(x),
    );
    addedMerchantUsernames.forEach(x => {
      const merchant = merchants.find(m => m.username === x);
      this.merchantRows[x] = new MerchantRow(merchant.username);
    })

    Object.values(this.merchantRows).forEach(merchantRow => {
      merchantRow.render(this.table)
    })
  }
}

class MerchantRow extends Component {
  constructor(username) {
    super();
    this.wrapper.setAttribute('class', 'cell');
    this.wrapper.textContent = username;
    this.wrapper.addEventListener('click', () =>
      window.history.pushState({}, '', `/comfy-valheim-app/merchants/${username}`),
    );
  }

  update(parent, props) {}
}
