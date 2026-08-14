import type { ImportedResidentPack } from './pack-importer';
import type { HistoryRecord } from './repository';
import type { LoaderSettings, GenerationFeature } from './settings';
import type { ConnectionProfileSummary, TavernIdentity } from './st-adapter';
import type { ConversationSummary } from './context-builder';
import type { WorldInfoEntrySummary } from './world-info-adapter';

export interface LoaderPanelModel {
  identity: TavernIdentity | null;
  packs: ImportedResidentPack[];
  selectedPackId: string;
  settings: LoaderSettings;
  profiles: ConnectionProfileSummary[];
  histories: Record<GenerationFeature, HistoryRecord[]>;
  contextSummaries: Record<GenerationFeature, ConversationSummary>;
  idleContextSummary?: ConversationSummary;
  view: 'settings' | GenerationFeature;
  hasBinding: boolean;
  worldInfoEntries?: WorldInfoEntrySummary[];
}

function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(label: string, action: string): HTMLButtonElement {
  const node = element('button', 'resident-loader-button', label);
  node.type = 'button';
  node.dataset.action = action;
  return node;
}

function letterIcon(): SVGSVGElement {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(namespace, 'path');
  path.setAttribute('d', 'M4.5 6.75h15v10.5h-15zM5 7.25l7 5 7-5');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '1.7');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  svg.append(path);
  return svg;
}

function field(label: string, control: HTMLElement): HTMLLabelElement {
  const wrapper = element('label', 'resident-loader-field');
  wrapper.append(element('span', '', label), control);
  return wrapper;
}

function rangeControl(
  label: string,
  key: string,
  value: number,
  minimum: number,
  maximum: number,
  step = 1,
): HTMLLabelElement {
  const input = element('input');
  input.type = 'range';
  input.min = String(minimum);
  input.max = String(maximum);
  input.step = String(step);
  input.value = String(value);
  input.dataset.setting = key;
  const output = element('output', '', String(value));
  output.dataset.output = key;
  const wrapper = field(label, input);
  wrapper.append(output);
  return wrapper;
}

function worldInfoSelection(
  feature: GenerationFeature | 'idle',
  selectedIds: string[],
  entries: WorldInfoEntrySummary[],
  hasBinding: boolean,
): HTMLElement {
  const selected = new Set(selectedIds);
  const details = element('details', 'resident-loader-world-info');
  const selectedCount = entries.filter((entry) => selected.has(entry.id)).length;
  details.append(element(
    'summary',
    '',
    `世界書常駐條目（已選 ${selectedCount}／${entries.length}）`,
  ));
  details.append(element(
    'p',
    'resident-loader-help',
    '只列出酒館判定為常駐且未停用的條目；勾選後才會加入這個功能的 Prompt。',
  ));
  if (!hasBinding) {
    details.append(element('p', 'resident-loader-empty', '先把桌寵包綁定目前角色，才能選擇角色正在使用的世界書條目。'));
    return details;
  }
  if (entries.length === 0) {
    details.append(element('p', 'resident-loader-empty', '目前角色沒有可選的世界書常駐條目。'));
    return details;
  }
  const list = element('div', 'resident-loader-world-info-list');
  for (const entry of entries) {
    const row = element('label', 'resident-loader-world-info-row');
    const checkbox = element('input');
    checkbox.type = 'checkbox';
    checkbox.value = entry.id;
    checkbox.checked = selected.has(entry.id);
    checkbox.dataset.worldInfoEntry = feature;
    const copy = element('span');
    copy.append(
      element('strong', '', `${entry.world}｜${entry.label}`),
      element('small', '', `${entry.content.length} 字 · ${entry.content.slice(0, 100)}${entry.content.length > 100 ? '…' : ''}`),
    );
    row.append(checkbox, copy);
    list.append(row);
  }
  details.append(list);
  return details;
}

function packSelector(model: LoaderPanelModel): HTMLElement {
  const section = element('section', 'resident-loader-section');
  section.append(element('h3', '', '角色包與綁定'));
  section.append(element(
    'p',
    'resident-loader-help',
    '每張角色卡可各自綁定一個桌寵包；切換角色卡時，桌寵會自動跟著切換。沒有綁定的角色不會沿用上一位的桌寵。',
  ));

  const importInput = element('input');
  importInput.type = 'file';
  importInput.accept = '.zip,application/zip';
  importInput.dataset.action = 'import';
  importInput.hidden = true;
  const importButton = button('選擇並匯入角色包（.jrpack.zip）', 'import-trigger');
  importButton.classList.add('resident-loader-button-primary', 'resident-loader-import-button');
  section.append(importButton, importInput);

  const select = element('select');
  select.dataset.packSelect = 'true';
  if (model.packs.length === 0) {
    const option = element('option', '', '還沒有角色包');
    option.value = '';
    select.append(option);
  } else {
    for (const pack of model.packs) {
      const option = element('option', '', pack.manifest.identity.displayName);
      option.value = pack.manifest.id;
      option.selected = pack.manifest.id === model.selectedPackId;
      select.append(option);
    }
  }
  section.append(field('已匯入的角色包', select));

  const bind = button('綁定目前角色', 'bind');
  bind.disabled = !model.identity || model.packs.length === 0;
  const unbind = button('解除目前角色綁定', 'unbind');
  unbind.disabled = !model.identity || !model.hasBinding;
  const actions = element('div', 'resident-loader-actions');
  actions.append(bind, unbind);
  section.append(actions);
  return section;
}

function appearanceSection(settings: LoaderSettings): HTMLElement {
  const section = element('section', 'resident-loader-section');
  section.append(element('h3', '', '外觀與速度'));
  section.append(element('p', 'resident-loader-help', '先選整體感覺即可；想精準調整時再打開進階微調。'));
  const presets = element('div', 'resident-loader-actions resident-loader-presets');
  for (const [key, label] of [
    ['slow', '慢一點'],
    ['normal', '正常'],
    ['fast', '快一點'],
  ] as const) {
    const preset = button(label, 'motion-preset');
    preset.dataset.motionPreset = key;
    presets.append(preset);
  }
  section.append(presets);
  const advanced = element('details', 'resident-loader-advanced');
  advanced.dataset.advancedMotion = 'true';
  advanced.append(element('summary', '', '進階微調（可不打開）'));
  const grid = element('div', 'resident-loader-grid');
  grid.append(
    rangeControl('桌機大小 %', 'desktopSizePercent', settings.appearance.desktopSizePercent, 60, 180),
    rangeControl('手機大小 %', 'mobileSizePercent', settings.appearance.mobileSizePercent, 60, 180),
    rangeControl('透明度', 'opacity', settings.appearance.opacity, 0.2, 1, 0.05),
    rangeControl('動作播放速度（數字越小越快）', 'frameIntervalMs', settings.motion.frameIntervalMs, 50, 1000, 5),
    rangeControl('畫面移動速度（數字越大走得越快）', 'walkSpeedPxPerSec', settings.motion.walkSpeedPxPerSec, 10, 500),
  );
  advanced.append(grid);
  section.append(advanced, button('重設桌寵位置', 'reset-position'));
  return section;
}

function idlePromptSection(
  settings: LoaderSettings,
  pack: ImportedResidentPack | undefined,
  profilesList: ConnectionProfileSummary[],
  contextSummary: ConversationSummary,
  worldInfoEntries: WorldInfoEntrySummary[],
  hasBinding: boolean,
): HTMLElement {
  const section = element('section', 'resident-loader-section');
  section.append(element('h3', '', '日常陪伴 Prompt'));
  const prompt = element('textarea');
  prompt.rows = 5;
  prompt.maxLength = 8_000;
  prompt.dataset.prompt = 'idle';
  const packPrompt = pack?.manifest.prompts.idle ?? '';
  prompt.value = settings.idlePromptOverride || packPrompt;
  prompt.placeholder = packPrompt || '先匯入並綁定角色包。';
  const recent = element('input');
  recent.type = 'number';
  recent.min = '0';
  recent.max = '50';
  recent.inputMode = 'numeric';
  recent.value = String(settings.idle.recentMessages);
  recent.dataset.recent = 'idle';

  const mode = element('select');
  mode.dataset.mode = 'idle';
  const current = element('option', '', '沿用目前酒館 API');
  current.value = 'current';
  const profileMode = element('option', '', '使用既有 Connection Profile');
  profileMode.value = 'profile';
  mode.append(current, profileMode);
  mode.value = settings.idle.mode;

  const profiles = element('select');
  profiles.dataset.profile = 'idle';
  const noProfile = element('option', '', profilesList.length ? '請選擇' : '酒館目前沒有可用 Profile');
  noProfile.value = '';
  profiles.append(noProfile);
  for (const item of profilesList) {
    const option = element('option', '', `${item.name}${item.model ? ` · ${item.model}` : ''}`);
    option.value = item.id;
    profiles.append(option);
  }
  profiles.value = settings.idle.profileId;

  const controls = element('div', 'resident-loader-grid');
  controls.append(
    field('帶入最近幾樓（0＝不帶）', recent),
    field('生成連線', mode),
    field('指定連線設定檔案', profiles),
  );
  const contextBox = element('details', 'resident-loader-context');
  const contextLabel = element('summary', '', `${contextSummary.messageCount} 樓 · 約 ${contextSummary.characterCount} 字（點開預覽）`);
  contextLabel.dataset.contextLabel = 'idle';
  const contextPreview = element('pre', '', contextSummary.preview || '日常陪伴目前不會帶入最近對話。');
  contextPreview.dataset.contextPreview = 'idle';
  contextBox.append(contextLabel, contextPreview);
  section.append(
    field('可見、可自行修改的日常 Prompt', prompt),
    element('p', 'resident-loader-help', '生成時會帶入目前角色卡的描述、性格與情境。只有按下按鈕才生成；自動生成目前關閉，也不會新增聊天樓層。'),
    controls,
    contextBox,
    worldInfoSelection('idle', settings.idle.worldInfoEntryIds, worldInfoEntries, hasBinding),
  );
  const actions = element('div', 'resident-loader-actions');
  const generate = button('讓桌寵說一句', 'generate:idle');
  generate.disabled = !pack;
  actions.append(button('恢復角色包預設 Prompt', 'reset-prompt:idle'), generate);
  section.append(actions);
  return section;
}

function featureSettingsSection(
  feature: GenerationFeature,
  model: LoaderPanelModel,
  pack: ImportedResidentPack | undefined,
): HTMLElement {
  const featureSettings = model.settings.features[feature];
  const label = feature === 'letters' ? '角色來信設定' : '對話番外設定';
  const section = element('section', 'resident-loader-section resident-loader-feature');
  section.dataset.featureSettings = feature;
  section.append(element('h3', '', label));

  const prompt = element('textarea');
  prompt.rows = 6;
  prompt.maxLength = 8_000;
  prompt.dataset.prompt = feature;
  const packPrompt = pack?.manifest.prompts[feature] ?? '';
  prompt.value = featureSettings.promptOverride || packPrompt;
  prompt.placeholder = packPrompt || '先匯入並綁定角色包。';
  section.append(field('可見、可自行修改的 Prompt', prompt));

  const recent = element('input');
  recent.type = 'number';
  recent.min = '0';
  recent.max = '50';
  recent.inputMode = 'numeric';
  recent.value = String(featureSettings.recentMessages);
  recent.dataset.recent = feature;

  const mode = element('select');
  mode.dataset.mode = feature;
  const current = element('option', '', '沿用目前酒館 API');
  current.value = 'current';
  const profile = element('option', '', '使用既有 Connection Profile');
  profile.value = 'profile';
  mode.append(current, profile);
  mode.value = featureSettings.mode;

  const profiles = element('select');
  profiles.dataset.profile = feature;
  const noProfile = element('option', '', model.profiles.length ? '請選擇' : '酒館目前沒有可用 Profile');
  noProfile.value = '';
  profiles.append(noProfile);
  for (const item of model.profiles) {
    const suffix = item.model ? ` · ${item.model}` : '';
    const option = element('option', '', `${item.name}${suffix}`);
    option.value = item.id;
    profiles.append(option);
  }
  profiles.value = featureSettings.profileId;

  const controls = element('div', 'resident-loader-grid');
  controls.append(field('帶入最近幾樓（0＝不帶）', recent), field('生成連線', mode), field('指定連線設定檔案', profiles));
  section.append(controls);

  const summary = model.contextSummaries[feature];
  const contextBox = element('details', 'resident-loader-context');
  const summaryLabel = element(
    'summary',
    '',
    `${summary.messageCount} 樓 · 約 ${summary.characterCount} 字（點開預覽）`,
  );
  summaryLabel.dataset.contextLabel = feature;
  const preview = element(
    'pre',
    '',
    summary.preview || '這個功能目前不會帶入最近對話。',
  );
  preview.dataset.contextPreview = feature;
  contextBox.append(summaryLabel, preview);
  section.append(contextBox);
  section.append(worldInfoSelection(
    feature,
    featureSettings.worldInfoEntryIds,
    model.worldInfoEntries ?? [],
    model.hasBinding,
  ));

  const actions = element('div', 'resident-loader-actions');
  const generate = button(
    feature === 'letters' ? '生成一封新來信' : '生成一篇新番外',
    `generate:${feature}`,
  );
  generate.disabled = !model.identity || !pack;
  actions.append(button('恢復角色包預設 Prompt', `reset-prompt:${feature}`), generate);
  section.append(actions);

  return section;
}

function historyView(feature: GenerationFeature, model: LoaderPanelModel): HTMLElement {
  const isLetters = feature === 'letters';
  const section = element(
    'section',
    isLetters
      ? 'resident-loader-history resident-loader-diary-list'
      : 'resident-loader-history resident-loader-board-list',
  );
  section.dataset.historyView = feature;
  const records = model.histories[feature];
  if (!isLetters) {
    const characterName = model.identity?.characterName ?? '目前角色';
    section.append(element(
      'p',
      'resident-loader-board-intro',
      `${characterName}的番外收藏 · ${records.length} 則收藏`,
    ));
  }
  if (records.length === 0) {
    section.append(element(
      'p',
      'resident-loader-empty',
      isLetters ? '這段聊天目前還沒有收到來信。' : '這段聊天目前還沒有生成番外。',
    ));
  }
  let currentMonth = '';
  for (const [index, record] of records.entries()) {
    const date = new Date(record.createdAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (isLetters && monthKey !== currentMonth) {
      currentMonth = monthKey;
      section.append(element(
        'h3',
        'resident-loader-diary-month',
        `${String(date.getMonth() + 1).padStart(2, '0')} / ${date.getFullYear()}`,
      ));
    }
    const article = element(
      'article',
      `resident-loader-record ${isLetters
        ? 'resident-loader-diary-entry'
        : `resident-loader-board-post resident-loader-board-post-tone-${(index % 4) + 1}`}`,
    );
    article.dataset.historyId = String(record.id);
    const dateTime = date.toISOString();
    const formattedTime = date.toLocaleString('zh-TW');
    const content = element('div', 'resident-loader-record-content', record.content);
    const recordActions = element('div', 'resident-loader-actions');
    const copy = button('複製', 'copy-history');
    copy.dataset.historyId = String(record.id);
    const remove = button('刪除', 'delete-history');
    remove.dataset.historyId = String(record.id);
    recordActions.append(copy, remove);

    if (isLetters) {
      const rail = element('div', 'resident-loader-date-rail');
      const time = element('time');
      time.dateTime = dateTime;
      time.setAttribute('aria-label', formattedTime);
      time.append(
        element('span', 'resident-loader-date-day', String(date.getDate()).padStart(2, '0')),
        element('span', 'resident-loader-date-weekday', new Intl.DateTimeFormat('zh-TW', { weekday: 'short' }).format(date)),
      );
      const icon = element('span', 'resident-loader-date-icon');
      icon.append(letterIcon());
      rail.append(time, icon);

      const sheet = element('div', 'resident-loader-letter-sheet');
      sheet.append(
        element('p', 'resident-loader-letter-kicker', `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} · LETTER`),
        content,
        recordActions,
      );
      article.append(rail, sheet);
    } else {
      const number = element('span', 'resident-loader-board-post-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      const note = element('div', 'resident-loader-board-note');
      const time = element('time', 'resident-loader-record-meta', formattedTime);
      time.dateTime = dateTime;
      note.append(time, content, recordActions);
      article.append(number, note);
    }
    section.append(article);
  }
  return section;
}

export function createLoaderPanel(model: LoaderPanelModel): HTMLElement {
  const panel = element('section', `resident-loader-panel resident-loader-page resident-loader-${model.view}-page`);
  panel.id = 'resident-loader-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'resident-loader-title');

  const header = element('header', 'resident-loader-panel-header');
  const titleText = model.view === 'letters'
    ? '角色來信日記'
    : model.view === 'stories'
      ? '對話番外留言板'
      : '酒館桌寵設定';
  const title = element('h2', '', titleText);
  title.id = 'resident-loader-title';
  const headerActions = element('div', 'resident-loader-actions');
  if (model.view === 'settings') {
    headerActions.append(button('儲存設定', 'save-settings'));
  } else {
    const download = button('下載 TXT', 'download-history');
    download.dataset.feature = model.view;
    headerActions.append(download);
  }
  headerActions.append(button('關閉', 'close'));
  header.append(title, headerActions);

  const identity = model.identity
    ? `目前角色：${model.identity.characterName}`
    : '請先打開一個角色聊天，再進行綁定。';
  const status = element('p', 'resident-loader-status', identity);
  status.dataset.status = 'true';

  const body = element('div', 'resident-loader-panel-body');
  const selectedPack = model.packs.find((pack) => pack.manifest.id === model.selectedPackId);
  if (model.view === 'settings') {
    body.append(
      packSelector(model),
      appearanceSection(model.settings),
      idlePromptSection(
        model.settings,
        selectedPack,
        model.profiles,
        model.idleContextSummary ?? { messageCount: 0, characterCount: 0, preview: '' },
        model.worldInfoEntries ?? [],
        model.hasBinding,
      ),
      featureSettingsSection('letters', model, selectedPack),
      featureSettingsSection('stories', model, selectedPack),
    );
  } else {
    body.append(historyView(model.view, model));
  }
  panel.append(header, status, body);
  return panel;
}
