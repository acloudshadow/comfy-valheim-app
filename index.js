const COMFY_VALHEIM_GUILD_ID = "820120530107367435";
const EXALTED_ROLE_ID = "833814379443126292";
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/"
  + "AKfycbybTGEoJ8NGQ2IP3ZxiHdh188CflNeiJJqSWHAFwb0UWybrVLcODOHr07nKNTDFrKH8Dg"
  + "/exec";

function setUsername() {
  const username = document.getElementById('username').value;
  setCookie('username', username);
  loadDashbard();
}

function loadDashbard() {
  try {
    Dashboard(document.body, {username: getCookie('username')});
  } catch (err) {
    console.error(err);
    document.body.innerHTML = 'Whoops, there was an error :(';
  }
}

window.onload = async () => {
  const username = getCookie('username');
  if (!username) {
    document.body.innerHTML = `
      <div style='
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        margin: 1em;
      '>
        What username do you use in the contracts spreadsheet?
        <br/>
        <div><input style="margin-top: 10px" placeholder="username" id='username'/>
        <button style="margin-bottom: 10px" onclick='setUsername()'>Submit</button></div>
        (This is manual for now, but I'd like to hook up discord login.)
        </div>
    `;
  } else {
    loadDashbard();
  }

  // const discord_access_token = getCookie('discord_access_token');
  // if (discord_access_token == null) {
  //   window.location = 'log_in.html';
  //   return;
  // }
  // try {
    // const identityResp = await fetch('https://discord.com/api/oauth2/@me', {
    //   headers: {Authorization: `Bearer ${discord_access_token}`}
    // })
    // const { user } = await identityResp.json();
    // const x = await fetch(`https://discord.com/api/users/@me/guilds`, {
    //     headers: {Authorization: `Bearer ${discord_access_token}`}
    //   });
    // const guildMemberResp = await fetch(`https://discord.com/api/guilds/${COMFY_VALHEIM_GUILD_ID}`
    //   + `/members/${user.id}`, {
    //     headers: {Authorization: `Bearer ${discord_access_token}`}
    //   });
    // const guildMember = await guildMemberResp.json();
    // if (guildMember.roles.includes(EXALTED_ROLE_ID)) {
    //   document.body.innerHTML = `Logged in as ${guildMember.nick}, you are exalted!`;
    // } else {
    //   document.body.innerHTML = `Logged in as ${guildMember.nick}.`;
    // }
  //   Dashboard(document.body, {username: getCookie('username')});
  // } catch (err) {
  //   console.error(err);
  //   document.body.innerHTML = 'Whoops, there was an error :(';
  // }
}
