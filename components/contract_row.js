function formatDate(serialized) {
  if (!serialized) {
    return null;
  }
  let formatted = new Date(serialized).toDateString();
  if (formatted === 'Invalid Date') {
    return serialized;
  }
  formatted = formatted.substring(formatted.indexOf(' ') + 1);
  return formatted;
}

class ContractRow extends Component {
  constructor({ contract, username, exalted }) {
    super();
    this.contract = contract;
    this.wrapper.classList.add('table-row');
    this.wrapper.setAttribute('id', `contract-${contract.rowNum}`);

    this.status = contract.dateCompleted
      ? 'completed'
      : contract.claimedBy
        ? 'in-progress'
        : 'unclaimed';

    this.wrapper.setAttribute(`data-status`, this.status);

    let dateListed = formatDate(contract.dateListed);
    let dateCompleted = formatDate(contract.dateCompleted);

    [
      [contract.what, 'what'],
      [dateListed, 'date-listed'],
      [contract.owner, 'owner'],
      [contract.claimedBy, 'claimed-by'],
      [contract.payment, 'payment'],
      [dateCompleted, 'date-completed'],
    ].forEach(([value, key]) =>
      this.wrapper.insertAdjacentHTML(
        'beforeend',
        `
      <div class="cell" id="${key}-${contract.rowNum}"}>
        ${value ? value : '-'}
      </div>
    `,
      ),
    );

    this.wrapper.appendChild(new ActionButtons({ contract, username, exalted }).wrapper);
  }

  update(parent, {initialStatuses, filters}) {
    let visible = true;
    if (!initialStatuses.includes(this.status)) {
      this.wrapper.classList.add('hidden')
      this.wrapper.setAttribute('data-hidden-by', 'status')
      return;
    }
    for (let key of Object.keys(filters)) {
      if (!compareLowerCaseTrim(this.contract[key], filters[key])) {
        this.wrapper.classList.add('hidden')
        this.wrapper.setAttribute('data-hidden-by', 'filters')
        return;
      }
    }
    this.wrapper.classList.remove('hidden')
    this.wrapper.removeAttribute('data-hidden-by')
  }
}

function updateContract(contract, { username, exalted, isDelete }) {
  [
    [contract.what, 'what'],
    [contract.dateListed, 'date-listed'],
    [contract.owner, 'owner'],
    [contract.claimedBy, 'claimed-by'],
    [contract.payment, 'payment'],
    [contract.dateCompleted, 'date-completed'],
  ].forEach(([value, key]) => {
    const cell = document.getElementById(`${key}-${contract.rowNum}`);
    if (isDelete) {
      cell.classList.add('deleted');
    }
    updateStatusAttribute(cell, contract);
    cell.innerHTML = value ? value : '-';
  });

  const actions = document.getElementById(`actions-${contract.rowNum}`);
  if (isDelete) {
    actions.classList.add('deleted');
  }
  updateStatusAttribute(actions, contract);
  actions.innerHTML = '';
  ActionButtons(actions, { contract, username, exalted });
}

function updateStatusAttribute(element, contract) {
  const statuses = ['completed', 'in-progress', 'unclaimed'];
  const status = contract.dateCompleted
    ? 'completed'
    : contract.claimedBy
      ? 'in-progress'
      : 'unclaimed';

  let needsAttr = true;
  for (let oldStatus in statuses) {
    if (element.hasAttribute(`data-status-${oldStatus}`)) {
      if (status === oldStatus) {
        needsAttr = false;
      } else {
        element.removeAttribute(`data-status-${oldStatus}`);
      }
      break;
    }
  }
  if (needsAttr) {
    element.setAttribute(`data-status-${status}`, '');
  }
}

class DeleteContract extends Component {
  static wrapperType = 'button';

  constructor(contractRowNum) {
    super();
    this.wrapper.textContent = 'Delete';
    this.wrapper.addEventListener('click', () =>
      postUpdate(
        `contracts/${contractRowNum}/delete`,
        {},
        { username, exalted, isDelete: true },
      ),
    );
  }

  update(parent, props) {}
}

class CompleteContract extends Component {
  static wrapperType = 'button';

  constructor(contractRowNum) {
    super();
    this.wrapper.textContent = 'Complete';
    this.wrapper.addEventListener('click', () => {
      console.log('would complete contract', contract.rowNum);
    });
  }

  update(parent, props) {}
}

class UnclaimContract extends Component {
  static wrapperType = 'button';

  constructor(contractRowNum) {
    super();
    this.wrapper.textContent = 'Unclaim';
    this.wrapper.addEventListener('click', () =>
      postUpdate(`contracts/${contractRowNum}/claim`, { username: '' }, { username, exalted }),
    );
  }

  update(parent, props) {}
}

class ClaimContract extends Component {
  static wrapperType = 'button';

  constructor(contractRowNum) {
    super();
    this.wrapper.textContent = 'Claim';
    this.wrapper.addEventListener('click', () =>
      postUpdate(`contracts/${contractRowNum}/claim`, { username }, { username, exalted }),
    );
  }

  update(parent, props) {}
}

class ActionButtons extends Component {
  constructor({ contract, username, exalted }) {
    super();
    this.wrapper.setAttribute('id', `actions-${contract.rowNum}`);
    this.wrapper.setAttribute(`data-status-${status}`, '');
    this.wrapper.setAttribute('class', 'cell');

    let hasActions = false;
    if (!contract.claimedBy && compareLowerCaseTrim(contract.owner, username)) {
      this.wrapper.appendChild(new DeleteContract(contract.rowNum).wrapper);
      hasActions = true;
      if (contract.claimedBy) {
        this.wrapper.appendChild(new CompleteContract(contract.rowNum).wrapper);
      }
    }
    if (!contract.dateCompleted && compareLowerCaseTrim(contract.claimedBy, username)) {
      this.wrapper.appendChild(new UnclaimContract(contract.rowNum).wrapper);
      hasActions = true;
    }
    if (!contract.claimedBy && !exalted && !compareLowerCaseTrim(contract.owner, username)) {
      this.wrapper.appendChild(new ClaimContract(contract.rowNum).wrapper);
      hasActions = true;
    }
    if (!hasActions) {
      this.wrapper.textContent = '-';
    }
  }

  update(parent, props) {}
}

async function postUpdate(route, body, { username, exalted, isDelete }) {
  const resp = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?path=${route}`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (resp.status !== 200) {
    GenericErrorModal();
  } else {
    const contract = await resp.json();
    updateContract(contract || {}, { username, exalted, isDelete });
  }
}
