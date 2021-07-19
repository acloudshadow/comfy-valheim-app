function Dashboard(parent, {username, exalted}) {
  const main = document.createElement('div')
  main.setAttribute('id', 'main');
  Loading(main);

  Header(parent, {username, exalted})
  parent.appendChild(main);
  document.getElementById('all-contracts').click()
}
