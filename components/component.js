class Component {
  static wrapperType = 'div';

  constructor() {
    this.state = {};
    this.wrapper = this.constructor.wrapperType
      ? document.createElement(this.constructor.wrapperType)
      : null;
    this.parent = null;
    this.props = null;
  }

  setState(data) {
    let updated = false;
    for (let [key, value] of Object.entries(data)) {
      if (this.state[key] === value) {
        continue;
      }
      this.state[key] = value;
      updated = true;
    }
    if (updated) {
      this.render(this.parent, this.props);
    }
  }

  update(parent, props) {
    throw Error(`${this.constructor.name}.update: Not implemented`);
  }

  render(parent, props) {
    this.parent = parent;
    this.props = props;
    this.update(parent, props);
    if (this.wrapper && !parent.contains(this.wrapper)) {
      parent.appendChild(this.wrapper);
    }
  }

  remove() {
    if (!this.wrapper) {
      throw Error(`${this.constructor.name}.remove: Not implemented`);
    }
    this.wrapper.remove();
  }

  updateCollection(itemComponentsById, itemDataById, createComponent, renderComponent) {
    const oldIds = Object.keys(itemComponentsById);
    const newIds = Object.keys(itemDataById);
    const removedIds = oldIds.filter(x => !newIds.includes(x));
    removedIds.forEach(id => {
      itemComponentsById[id].remove();
      delete itemComponentsById[id];
    });

    const addedIds = newIds.filter(x => !oldIds.includes(x));
    addedIds.forEach(id => {
      const data = itemDataById[id];
      itemComponentsById[id] = createComponent(id, data);
    });

    Object.entries(itemComponentsById).forEach(([id, component]) => {
      renderComponent(id, component);
    });
  }
}
