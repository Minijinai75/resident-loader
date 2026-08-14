function menuButton(label: string, view: 'letters' | 'stories', handler: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'resident-loader-quick-button';
  button.textContent = label;
  button.dataset.view = view;
  button.addEventListener('click', handler);
  return button;
}

export function createPetQuickMenu(options: {
  openLetters: () => void;
  openStories: () => void;
}): HTMLElement {
  const menu = document.createElement('div');
  menu.id = 'resident-loader-quick-menu';
  menu.className = 'resident-loader-quick-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', '桌寵紀錄');
  menu.append(
    menuButton('來信紀錄', 'letters', options.openLetters),
    menuButton('對話番外紀錄', 'stories', options.openStories),
  );
  return menu;
}
