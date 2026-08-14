function actionButton(label: string, action: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'menu_button resident-loader-entry-button';
  button.textContent = label;
  button.dataset.action = action;
  return button;
}

export function createExtensionEntry(): HTMLElement {
  const entry = document.createElement('div');
  entry.id = 'resident-loader-settings-entry';
  entry.className = 'inline-drawer resident-loader-extension-entry';

  const toggle = document.createElement('div');
  toggle.className = 'inline-drawer-toggle inline-drawer-header';
  toggle.setAttribute('role', 'button');
  toggle.tabIndex = 0;
  toggle.setAttribute('aria-expanded', 'false');
  const heading = document.createElement('b');
  heading.textContent = '酒館桌寵';
  const icon = document.createElement('div');
  icon.className = 'inline-drawer-icon fa-solid fa-circle-chevron-down down';
  toggle.append(heading, icon);

  const content = document.createElement('div');
  content.className = 'inline-drawer-content resident-loader-entry-body';
  const description = document.createElement('p');
  description.textContent = '這裡只放快捷入口；完整設定與紀錄會在獨立頁面開啟。';
  const actions = document.createElement('div');
  actions.className = 'resident-loader-entry-actions';
  const settings = actionButton('開啟桌寵設定', 'open-settings');
  settings.classList.add('resident-loader-entry-button-primary');
  actions.append(
    settings,
    actionButton('開啟桌寵', 'show-pet'),
    actionButton('關閉桌寵', 'hide-pet'),
    actionButton('角色來信日記', 'open-letters'),
    actionButton('對話番外留言板', 'open-stories'),
  );
  const status = document.createElement('p');
  status.className = 'resident-loader-entry-status';
  status.dataset.entryStatus = 'true';
  content.append(description, actions, status);
  entry.append(toggle, content);

  const setOpen = (open: boolean): void => {
    toggle.classList.toggle('open', open);
    content.classList.toggle('open', open);
    icon.classList.toggle('down', !open);
    icon.classList.toggle('up', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  const toggleOpen = (): void => {
    const open = !content.classList.contains('open');
    setOpen(open);
    if (open) entry.dispatchEvent(new Event('resident-loader:drawer-open'));
  };
  toggle.addEventListener('click', toggleOpen);
  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    toggleOpen();
  });
  return entry;
}
