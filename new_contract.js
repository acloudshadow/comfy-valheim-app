function loadDashbard() {
  try {
    const username = getCookie('username');
    Dashboard(
      document.body,
      {
        username,
        exalted: getCookie('exalted', {bool: true}),
        initialRender: (main) => NewContract(main, {username}),
      }
    );
  } catch (err) {
    console.error(err);
    document.body.innerHTML = 'Whoops, there was an error :(';
  }
}

window.onload = async () => {
  const discord_access_token = getCookie('discord_access_token');
  if (discord_access_token == null) {
    window.location = 'log_in.html';
    return;
  }
  loadDashbard();
}
