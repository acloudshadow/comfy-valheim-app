const ENV = "dev";
const COMFY_VALHEIM_GUILD_ID = ENV === 'dev' ? "850001189428920320" : "820120530107367435";
const EXALTED_ROLE_ID = ENV === 'dev' ? "866449001507192873": "833814379443126292";
const DISCORD_BOT_PROXY_URL = "https://comfy.acloudshadow.repl.co";

async function finalizeDiscordAuth() {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const state = params.get('state');
  if (state == null || state !== getCookie('auth_state')) {
    document.body.innerHTML = 'Invalid auth state';
    return;
  }
  clearCookie('auth_state');
  discord_access_token = params.get('access_token');
  setCookie('discord_access_token', discord_access_token);

  try {
    const identityResp = await fetch('https://discord.com/api/oauth2/@me', {
      headers: {Authorization: `Bearer ${discord_access_token}`}
    })
    const { user } = await identityResp.json();

    const guildMemberResp = await fetch(`${DISCORD_BOT_PROXY_URL}/guilds/${COMFY_VALHEIM_GUILD_ID}`
      + `/members/${user.id}`, {mode: 'cors'});
    const guildMember = await guildMemberResp.json();

    setCookie('username', parseNickname(guildMember.nick))
    setCookie('exalted', guildMember.roles.includes(EXALTED_ROLE_ID))
    window.location = 'index.html';
  } catch (err) {
    console.error(err);
    document.body.innerHTML = 'Whoops, there was an error :(';
  }
}

window.onload = finalizeDiscordAuth;

function parseNickname(nickname) {
  // remove super and subscripts
  return nickname.replace(/(?:\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]|[\u006E\u00B0\u00B2\u00B3\u00B9\u02AF\u0670\u0711\u2121\u213B\u2207\u29B5\uFC5B-\uFC5D\uFC63\uFC90\uFCD9\u2070\u2071\u2074-\u208E\u2090-\u209C\u0345\u0656\u17D2\u1D62-\u1D6A\u2A27\u2C7C\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F])+/g, '')
}
