async function MerchantsList(parent) {
  const container = document.createElement('div');
  container.setAttribute('id', 'inner-main');
  container.innerHTML = `<div class='title'>Merchants</div> Loading...`;
  parent.innerHTML = '';
  parent.appendChild(container);

  const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?path=merchants`);
  let merchants = await resp.json();
  merchants = merchants.filter(merchant => merchant.username != null);
  merchants = merchants.sort(
    (a, b) => (a.username > b.username ? 1 : a.username < b.username ? -1 : 0),
  );

  const merchantRows = document.createElement('div');
  merchantRows.setAttribute('class', 'table');
  merchantRows.setAttribute('id', 'merchants-table');
  merchantRows.style = `grid-template-columns: auto`;
  merchantRows.innerHTML = "<div class='header cell'>Name</div>";

  merchants.forEach(merchant => {
    const merchantRow = document.createElement('div');
    merchantRow.setAttribute('class', 'cell');
    merchantRow.textContent = merchant.username;
    merchantRow.addEventListener('click', () =>
      window.history.pushState({}, '', `/merchants/${merchant.username}`),
    );
    merchantRows.appendChild(merchantRow);
  });
  container.innerHTML = `<div class='title'>Merchants</div>`;
  container.appendChild(merchantRows);
}
