// @vitest-environment jsdom

import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { ResidentLoaderApp } from '../src/loader/app';

describe('ResidentLoaderApp shell', () => {
  let app: ResidentLoaderApp | undefined;

  afterEach(() => {
    app?.stop();
    document.body.replaceChildren();
  });

  it('mounts 酒館桌寵 inside the extensions drawer and never creates a floating launcher', async () => {
    const drawer = document.createElement('div');
    drawer.id = 'extensions_settings2';
    document.body.append(drawer);
    app = new ResidentLoaderApp(() => ({}));

    await app.start();

    expect(drawer.querySelector('#resident-loader-settings-entry')?.textContent).toContain('酒館桌寵');
    expect(document.querySelector('#resident-loader-launcher')).toBeNull();
  });

  it('mounts the settings panel inside the drawer when the header is expanded', async () => {
    const drawer = document.createElement('div');
    drawer.id = 'extensions_settings2';
    document.body.append(drawer);
    app = new ResidentLoaderApp(() => ({}));
    await app.start();

    drawer.querySelector<HTMLElement>('.inline-drawer-toggle')?.click();
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(drawer.querySelector('.inline-drawer-content #resident-loader-panel')).not.toBeNull();
    expect(document.querySelector('#resident-loader-panel')?.classList.contains('resident-loader-panel-inline')).toBe(true);
  });
});
