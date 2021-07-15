const COMFY_VALHEIM_GUILD_ID = "820120530107367435";
const EXALTED_ROLE_ID = "833814379443126292";
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/"
  + "AKfycbw55TUbsrRFKgHSfT_b2HB7xA87P7nbDZrprgtdNiAXp7qnO_ys63slp2z1Olc8eIGuDQ/exec";

window.onload = async () => {
  const discord_access_token = getCookie('discord_access_token');
  if (discord_access_token == null) {
    window.location = 'log_in.html';
    return;
  }
  try {
    const identityResp = await fetch('https://discord.com/api/oauth2/@me', {
      headers: {Authorization: `Bearer ${discord_access_token}`}
    })
    const { user } = await identityResp.json();
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
    Dashboard(document.body, {username: getCookie('username')});
  } catch (err) {
    console.error(err);
    document.body.innerHTML = 'Whoops, there was an error :(';
  }
}
