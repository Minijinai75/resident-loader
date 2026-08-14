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
  entry.className = 'resident-loader-extension-entry';

  const heading = document.createElement('h4');
  heading.textContent = '酒館桌寵';
  const description = document.createElement('p');
  description.textContent = '匯入角色包、調整設定，或開啟與關閉目前角色的桌寵。';
  const actions = document.createElement('div');
  actions.className = 'resident-loader-entry-actions';
  actions.append(
    actionButton('開啟設定', 'open-settings'),
    actionButton('開啟桌寵', 'show-pet'),
    actionButton('關閉桌寵', 'hide-pet'),
  );
  entry.append(heading, description, actions);
  return entry;
}
