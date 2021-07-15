function setCookie(key, value, { maxAge } = {}) {
  let cookie = `${key}=${value}; secure; samesite=strict`;
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
