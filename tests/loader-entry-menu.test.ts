// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { createExtensionEntry } from '../src/loader/extension-entry';
import { createPetQuickMenu } from '../src/loader/pet-menu';

describe('酒館桌寵 extension entry', () => {
  it('keeps the SillyTavern drawer compact and exposes separate page entrances', () => {
    const entry = createExtensionEntry();
    expect(entry.classList.contains('inline-drawer')).toBe(true);
    expect(entry.querySelector('.inline-drawer-toggle.inline-drawer-header')?.textContent).toContain('酒館桌寵');
    expect(entry.querySelector('.inline-drawer-content')).not.toBeNull();
    expect(entry.querySelector('[data-action="open-settings"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="show-pet"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="hide-pet"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="open-letters"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="open-stories"]')).not.toBeNull();
    expect(entry.querySelector('[data-panel-host]')).toBeNull();
    expect(entry.textContent).not.toContain('Resident Loader｜共用桌寵');
  });

  it('opens and closes its content when the native-style header is clicked', () => {
    const entry = createExtensionEntry();
    let openEvents = 0;
    entry.addEventListener('resident-loader:drawer-open', () => { openEvents += 1; });
    const toggle = entry.querySelector<HTMLElement>('.inline-drawer-toggle')!;
    const content = entry.querySelector<HTMLElement>('.inline-drawer-content')!;
    toggle.click();
    expect(toggle.classList.contains('open')).toBe(true);
    expect(content.classList.contains('open')).toBe(true);
    expect(openEvents).toBe(1);
    toggle.click();
    expect(content.classList.contains('open')).toBe(false);
    expect(openEvents).toBe(1);
  });
});

describe('pet quick menu', () => {
  it('opens one of two record views without generating anything by itself', () => {
    const openLetters = vi.fn();
    const openStories = vi.fn();
    const menu = createPetQuickMenu({ openLetters, openStories });
    document.body.append(menu);

    menu.querySelector<HTMLButtonElement>('[data-view="letters"]')?.click();
    expect(openLetters).toHaveBeenCalledTimes(1);
    expect(openStories).not.toHaveBeenCalled();

    menu.querySelector<HTMLButtonElement>('[data-view="stories"]')?.click();
    expect(openStories).toHaveBeenCalledTimes(1);
  });
});
