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

  setState(key, value) {
    if (this.state[key] === value) {
      return;
    }
    this.state[key] = value;
    this.render(this.parent, this.props);
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
}
