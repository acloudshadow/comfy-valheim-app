function Dashboard(parent, {
  username,
  exalted,
  initialRender = (main) => { document.getElementById('all-contracts').click() },
}) {
  const main = document.createElement('div')
  main.setAttribute('id', 'main');
  Loading(main);

  Header(parent, {username, exalted})
  parent.appendChild(main);
  initialRender(main);
}
