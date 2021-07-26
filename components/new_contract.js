function NewContract(parent, {username}) {
  parent.innerHTML = `
    <label for="description">What goods/services are you requesting?</label>
    <input id="description"/>
    <label for="payment">What payment are you offering?</label>
    <input id="payment"/>
  `;
  const submitButton = document.createElement('button');

  const createContract = async () => {
    const body = {
      what: document.getElementById('description').value,
      payment: document.getElementById('payment').value,
      owner: username,
    }
    const resp = await fetch(
      `${GOOGLE_APPS_SCRIPT_URL}?path=contracts`,
      {method: 'POST', body: JSON.stringify(body)},
    )
    if (resp.status !== 200) {
      GenericErrorModal();
    } else {
      main.textContent = "Contract added!";
      const createAnother = document.createElement('a');
      createAnother.setAttribute('href', '');
      createAnother.addEventListener('click', () => NewContract(parent, {username}));
      createAnother.textContent = 'Create another contract?';
      main.appendChild(createAnother);
    }
  }

  submitButton.addEventListener('click', createContract);
  submitButton.textContent = 'Create';
  parent.appendChild(submitButton);
}
