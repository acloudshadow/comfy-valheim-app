function formatDate(serialized) {
  if (!serialized) {
    return null;
  }
  let formatted = new Date(serialized).toDateString();
  if (formatted === 'Invalid Date') {
    return serialized;
  }
  formatted = formatted.substring(formatted.indexOf(" ") + 1);
  return formatted;
}

function ContractRow(parent, {contract, initialStatuses, username, exalted}) {
  const status = contract.dateCompleted ? "completed" : contract.claimedBy ? "in-progress" : 'unclaimed';
  const className = initialStatuses.includes(status) ? 'cell' : "cell hidden";

  let dateListed = formatDate(contract.dateListed);
  let dateCompleted = formatDate(contract.dateCompleted);

  [
    [contract.what, 'what'],
    [dateListed, 'date-listed'],
    [contract.owner, 'owner'],
    [contract.claimedBy, 'claimed-by'],
    [contract.payment, 'payment'],
    [dateCompleted, 'date-completed'],
  ].forEach(([value, key]) => parent.insertAdjacentHTML('beforeend', `
    <div data-status-${status} class="${className}" id="${key}-${contract.rowNum}"}>
      ${value ? value : '-'}
    </div>
  `))

  const actions = document.createElement('div');
  actions.setAttribute('id', `actions-${contract.rowNum}`);
  actions.setAttribute(`data-status-${status}`, '');
  actions.setAttribute("class", className);
  ActionButtons(actions, {contract, username, exalted});
  parent.appendChild(actions);
}


function updateContract(contract, {username, exalted, isDelete}) {
    [
      [contract.what, 'what'],
      [contract.dateListed, 'date-listed'],
      [contract.owner, 'owner'],
      [contract.claimedBy, 'claimed-by'],
      [contract.payment, 'payment'],
      [contract.dateCompleted, 'date-completed'],
    ].forEach(([value, key]) => {
      console.log(key, contract.rowNum, `${key}-${contract.rowNum}`)
      const cell = document.getElementById(`${key}-${contract.rowNum}`);
      if (isDelete) {
        cell.classList.add('deleted');
      }
      updateStatusAttribute(cell, contract)
      cell.innerHTML = value ? value : '-'
    })

    const actions = document.getElementById(`actions-${contract.rowNum}`);
    if (isDelete) {
      actions.classList.add('deleted');
    }
    updateStatusAttribute(actions, contract);
    actions.innerHTML = '';
    ActionButtons(actions, {contract, username, exalted})
}

function updateStatusAttribute(element, contract) {
  const statuses = ['completed', 'in-progress', 'unclaimed'];
  const status = contract.dateCompleted ? "completed" :
    contract.claimedBy ? "in-progress" : 'unclaimed';

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

function ActionButtons(parent, {contract, username, exalted}) {
  let addedButtons = false;
  if (!contract.claimedBy && compareLowerCaseTrim(contract.owner, username)) {
    const deleteAction = document.createElement('button');
    deleteAction.textContent = 'Delete';
    deleteAction.addEventListener('click', () => postUpdate(
      {fn: 'deleteContract', args: [contract.rowNum]},
      {username, exalted, isDelete: true},
    ));
    parent.appendChild(deleteAction);
    addedButtons = true;
    if (contract.claimedBy) {
      const completeAction = document.createElement('button');
      completeAction.textContent = 'Complete';
      completeAction.addEventListener('click', () => {
        console.log('would complete contract', contract.rowNum);
      });
      parent.appendChild(completeAction);
    }
  }
  if (!contract.dateCompleted && compareLowerCaseTrim(contract.claimedBy, username)) {
    const unclaimAction = document.createElement('button');
    unclaimAction.textContent = 'Unclaim';
    unclaimAction.addEventListener('click',
      () => postUpdate(
        {fn: 'claimContract', args: [contract.rowNum, '']},
        {username, exalted},
      ));
    parent.appendChild(unclaimAction);
    addedButtons = true;
  }
  if (!contract.claimedBy && !exalted && !compareLowerCaseTrim(contract.owner, username)) {
    const claimAction = document.createElement('button');
    claimAction.textContent = 'Claim';
    claimAction.addEventListener('click',
      () => postUpdate(
        {fn: 'claimContract', args: [contract.rowNum, username]},
        {username, exalted},
      ));
    parent.appendChild(claimAction);
    addedButtons = true;
  }
  if (!addedButtons) {
    parent.append('-');
  }
}

async function postUpdate(body, {username, exalted, isDelete}) {
  const resp = await fetch(
    `${GOOGLE_APPS_SCRIPT_URL}`,
    {method: 'POST', body: JSON.stringify(body)},
  )
  if (resp.status !== 200) {
    GenericErrorModal();
  } else {
    const contract = await resp.json();
    updateContract(contract || {}, {username, exalted, isDelete});
  }
}
