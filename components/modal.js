function Modal(parent, props) {
  const background = document.createElement('div');
  background.setAttribute('id', 'modal-background');

  function closeModal() {
    background.remove();
    document.body.removeEventListener('click', closeOnOutsideClick);
  }

  const container = document.createElement('div');
  container.setAttribute('id', 'modal-container');
  background.appendChild(container);

  const titleContainer = document.createElement('div');
  titleContainer.setAttribute('id', 'modal-title-container');

  const title = document.createElement('div')
  title.setAttribute('id', 'modal-title');
  title.textContent = props.title;
  titleContainer.appendChild(title)

  const close = document.createElement('div')
  close.setAttribute('id', 'modal-close');
  close.textContent = 'X';
  close.addEventListener('click', closeModal)
  titleContainer.appendChild(close)
  container.appendChild(titleContainer);

  const content = document.createElement('div');
  content.innerHTML = props.content;
  container.appendChild(content);

  parent.appendChild(background);

  function closeOnOutsideClick(ev) {
    if (!container.contains(ev.target)) {
      closeModal();
    }
  }

  document.body.addEventListener('click', closeModal);
}
