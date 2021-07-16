function Dashboard(parent, {username}) {
  const main = document.createElement('div')
  main.setAttribute('id', 'main');
  Loading(main);

  Header(parent, {username})
  parent.appendChild(main);
  document.getElementById('all-contracts').click()
}
