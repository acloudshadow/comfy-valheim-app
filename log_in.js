const DISCORD_CLIENT_ID = "864341473637695498";

function uuidv4() {
  // https://stackoverflow.com/a/2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function initiateDiscordAuth() {
  const state = uuidv4();
  setCookie('auth_state', state, { maxAge: 60*10 });
  const url = "https://discord.com/api/oauth2/authorize?response_type=token&"
    + `client_id=${DISCORD_CLIENT_ID}&state=${state}&scope=identify%20guilds%20bot`;
  window.location = url;
}
