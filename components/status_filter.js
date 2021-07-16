
function hideContractsWithStatus(status) {
  const cells = document.querySelectorAll(`div[data-status-${status}]`)
  cells.forEach(cell => cell.classList.add('hidden'))
}

function showContractsWithStatus(status) {
  const cells = document.querySelectorAll(`div[data-status-${status}]`)
  cells.forEach(cell => cell.classList.remove('hidden'))
}

function StatusOption(parent, {statusName, initialStatuses}) {
  const status = statusName.toLowerCase().replace(' ', '-');
  const checkbox = document.createElement('input');
  const checkboxId = `${status}-status`;
  checkbox.setAttribute('id', checkboxId);
  checkbox.setAttribute('type', 'checkbox');
  if (initialStatuses.includes(status)) {
    checkbox.setAttribute('checked', '');
  }
  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      showContractsWithStatus(status)
    } else {
      hideContractsWithStatus(status)
    }
  })
  parent.appendChild(checkbox);
  parent.insertAdjacentHTML('beforeend', `<label for="${checkboxId}">${statusName}</label>`)
}

function StatusFilter(parent, {initialStatuses, excludeStatusFilterNames}) {
  const statusFilter = document.createElement('div');
  statusFilter.setAttribute('id', 'status-filter');
  statusFilter.textContent = "Statuses:";
  ['Unclaimed', 'In Progress', 'Completed'].forEach(statusName => {
    if (!excludeStatusFilterNames.includes(statusName)) {
      StatusOption(statusFilter, {statusName, initialStatuses});
    }
  })
  parent.appendChild(statusFilter);
}
