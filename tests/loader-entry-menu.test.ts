// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { createExtensionEntry } from '../src/loader/extension-entry';
import { createPetQuickMenu } from '../src/loader/pet-menu';

describe('酒館桌寵 extension entry', () => {
  it('lives in the extension drawer with explicit settings, on, and off actions', () => {
    const entry = createExtensionEntry();
    expect(entry.querySelector('h4')?.textContent).toBe('酒館桌寵');
    expect(entry.querySelector('[data-action="open-settings"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="show-pet"]')).not.toBeNull();
    expect(entry.querySelector('[data-action="hide-pet"]')).not.toBeNull();
    expect(entry.textContent).not.toContain('Resident Loader｜共用桌寵');
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
