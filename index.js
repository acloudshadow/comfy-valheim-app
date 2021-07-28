const onPushStateCallbacks = [];

function onPushState(callback) {
  onPushStateCallbacks.push(callback);
}

const originalPushState = window.history.pushState;
window.history.pushState = (...args) => {
  originalPushState.call(window.history, ...args);
  onPushStateCallbacks.forEach(callback => callback());
};

window.onload = async () => {
  const discord_access_token = getCookie('discord_access_token');
  if (discord_access_token == null) {
    window.location = 'log_in.html';
    return;
  }
  const dashboard = new Dashboard({
    username: getCookie('username'),
    exalted: getCookie('exalted', { bool: true }),
  });

  const renderDashboard = () => {
    const pathParts = window.location.pathname.split('/').filter(x => x !== '');
    if (pathParts[0] !== 'comfy-valheim-app') {
      return NotFound(document.body);
    }
    pathParts.shift();
    dashboard.render(document.body, {
      pathParts,
    });
  };

  window.onpopstate = renderDashboard;
  onPushState(renderDashboard);
  renderDashboard();
};
