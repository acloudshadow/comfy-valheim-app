function setCookie(key, value, { maxAge } = {}) {
  let cookie = `${key}=${value}; secure; samesite=strict`;
  if (maxAge !== undefined) {
    cookie += `; max-age=${maxAge}`;
  }
  document.cookie = cookie;
}

function getCookie(key, {bool = false} = {}) {
  value = document.cookie.split(";")?.find(x => x.trim().startsWith(key + '='))?.split("=")?.[1];
  if (bool) {
    if (value === 'false') {
      return false;
    }
    if (value !== 'true') {
      throw Error(`Unexpected value for boolean cookie: ${value}`)
    }
    return true;
  }
  return value;
}

function clearCookie(key) {
  document.cookie = `${key}=; max-age=0`;
}
