function hideContractsWithStatus(status) {
  const cells = document.querySelectorAll(`div[data-status=${status}]:not([data-hidden-by])`);
  cells.forEach(cell => {
    cell.classList.add('hidden');
    cell.setAttribute('data-hidden-by', 'status');
  });
}

function showContractsWithStatus(status) {
  const cells = document.querySelectorAll(`div[data-status=${status}][data-hidden-by=status]`);
  cells.forEach(cell => {
    cell.classList.remove('hidden');
    cell.removeAttribute('data-hidden-by');
  });
}

class StatusOption extends Component {
  wrapperType = null;

  constructor({ statusName, initialStatuses }) {
    super();
    this.checkbox = document.createElement('input');
    this.checkbox.setAttribute('type', 'checkbox');

    this.status = statusName.toLowerCase().replace(' ', '-');
    const checkboxId = `${this.status}-status`;
    this.checkbox.setAttribute('id', checkboxId);

    this.checkbox.addEventListener('change', e => {
      if (e.target.checked) {
        showContractsWithStatus(this.status);
      } else {
        hideContractsWithStatus(this.status);
      }
    });

    if (initialStatuses.includes(this.status)) {
      this.checkbox.setAttribute('checked', '');
    }

    this.labelHTML = `<label for="${checkboxId}">${statusName}</label>`;
  }

  update(parent, props) {
    if (!parent.contains(this.checkbox)) {
      parent.appendChild(this.checkbox);
      parent.insertAdjacentHTML('beforeend', this.labelHTML);
    }
  }
}

class StatusFilter extends Component {
  constructor() {
    super();
    this.wrapper.setAttribute('id', 'status-filter');
  }

  update(parent, { initialStatuses, excludeStatusFilterNames = [] } = {}) {
    this.wrapper.innerHTML = 'Statuses:<br/>';
    ['Unclaimed', 'In Progress', 'Completed'].forEach(statusName => {
      if (!excludeStatusFilterNames.includes(statusName)) {
        new StatusOption({ statusName, initialStatuses }).render(this.wrapper);
      }
    });
  }
}
