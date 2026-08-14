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

    expect(drawer.querySelector('#resident-loader-settings-entry h4')?.textContent).toBe('酒館桌寵');
    expect(document.querySelector('#resident-loader-launcher')).toBeNull();
  });
});
