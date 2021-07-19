const ENV = "dev";
const GOOGLE_APPS_SCRIPT_URL = ENV === 'dev' ? "https://script.google.com/macros/s/"
  + "AKfycby28Pym2mjOYzqxdbTGn0k6P0rkN1i_VPp12tfmtRKBfKLOu37ebK8o-JK6XhqtnAt7Nw"
  + "/exec" : "";

function setUsername() {
  const username = document.getElementById('username').value;
  setCookie('username', username);
  loadDashbard();
}

function loadDashbard() {
  try {
    Dashboard(document.body, {username: getCookie('username'), exalted: getCookie('exalted')});
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
