const DISCORD_CLIENT_ID = "864341473637695498";

function uuidv4() {
  // https://stackoverflow.com/a/2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function setCookie(key, value, { maxAge } = {}) {
  let cookie = `${key}=${state}; secure; samesite=strict`;
  if (maxAge !== undefined) {
    cookie += `; max-age=${maxAge}`;
  }
  document.cookie = cookie;
}

function getCookie(key) {
  return document.cookie.split(";")?.find(x => x.trim().startsWith(key + '='))?.split("=")?.[1];
}

function clearCookie(key) {
  document.cookie = `${key}=; max-age=0`;
}
