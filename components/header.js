class HeaderMenuItem extends Component {
  constructor({id, textContent}) {
    super();
    this.wrapper.classList.add('header-menu-item');
    this.wrapper.setAttribute('id', id);
    this.wrapper.textContent = textContent;
  }

  update(parent, {active}) {
    if (active) {
      this.wrapper.classList.add('active');
    } else {
      this.wrapper.classList.remove('active');
    }
  }
}

class Header extends Component {
  constructor(menuItemsProps) {
    super();
    this.headerMenuItems = menuItemsProps.map(menuItemProps => new HeaderMenuItem(menuItemProps));
    this.wrapper.setAttribute('id', 'header');
    this.wrapper.innerHTML = `
      <div style="display: flex; align-items: center;  margin: 1em 0">
        <div style="width: 30%; flex-grow: 0; flex-shrink: 0; padding-right: 0.5em; padding-left: 1em;">
          <img style="width: 100%; border-radius: 100%;" src='/comfy-valheim-app/assets/icon.jpg'/>
        </div>
        <div style="text-align:center;">Comfy<br/>Valheim</div>
      </div>
    `;
    this.wrapper.addEventListener('click', (ev) => {
      if (!ev.target.classList.contains('header-menu-item')) {
        return;
      }
      window.history.pushState({}, '', `/comfy-valheim-app/${ev.target.id}`);
    });
  }


  update({activeHeaderItemId}) {
    this.headerMenuItems.forEach(headerMenuItem => {
      headerMenuItem.render(
        this.wrapper,
        {active: headerMenuItem.wrapper.id === activeHeaderItemId},
      )
    })
  }
}
