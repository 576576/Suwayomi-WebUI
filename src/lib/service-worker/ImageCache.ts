/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';

// !!! IMPORTANT !!! - Update along with vite.config.ts workbox config
export enum ImageCacheKey {
    OTHER = 'image-cache-other',
    EXTENSION_ICONS = 'image-cache-extension-icons',
    MANGA_THUMBNAILS = 'image-cache-manga-thumbnails',
    CHAPTER_PAGES = 'image-cache-chapter-pages',
}

const IMAGE_CACHE_KEYS = Object.values(ImageCacheKey);

if (window.caches) {
    caches.delete('image-cache').catch(defaultPromiseErrorHandler('ImageCache: delete removed "image-cache"'));
}

export class ImageCache {
    /**
     * `caches` 不一定存在（非安全上下文里就没有），直接引用会抛 `ReferenceError`。
     * 没有就当"没有缓存可清/可读"，而不是把「清除缓存」变成一条报错。
     */
    private static cacheApi(): CacheStorage | undefined {
        return typeof caches === 'undefined' ? undefined : caches;
    }

    // !!! IMPORTANT !!! - Update along with vite.config.ts workbox config
    static getKeyFor(url: string): ImageCacheKey {
        if (url.match(/\/chapter\/[0-9]+\/page\/[0-9]+/g)) {
            return ImageCacheKey.CHAPTER_PAGES;
        }

        if (url.match(/\/manga\/[0-9]+\/thumbnail/g)) {
            return ImageCacheKey.MANGA_THUMBNAILS;
        }

        if (url.includes('/extension/icon/')) {
            return ImageCacheKey.EXTENSION_ICONS;
        }

        return ImageCacheKey.OTHER;
    }

    static async has(url: string, key: ImageCacheKey = this.getKeyFor(url)): Promise<boolean> {
        const api = this.cacheApi();
        if (!api) {
            return false;
        }

        try {
            const cache = await api.open(key);
            const response = await cache.match(url, { ignoreVary: true });

            return response !== undefined;
        } catch (error) {
            return false;
        }
    }

    static async get(url: string, key: ImageCacheKey = this.getKeyFor(url)): Promise<Response | null> {
        const api = this.cacheApi();
        if (!api) {
            return null;
        }

        try {
            const cache = await api.open(key);
            const response = await cache.match(url);

            return response || null;
        } catch (error) {
            return null;
        }
    }

    static async clear(key: ImageCacheKey): Promise<void> {
        const api = this.cacheApi();
        if (!api) {
            return;
        }

        const cache = await api.open(key);
        const imageKeys = await cache.keys();

        await Promise.all(imageKeys.map((imageKey) => cache.delete(imageKey)));
    }

    static async clearAll(): Promise<void> {
        // 用箭头函数包一层，别写 `map(ImageCache.clear)`：那样会把方法从类上摘下来
        // 调用，`this` 丢了。顺带等所有 key 清完 —— 调用方拿它的完成当「清完了」用。
        await Promise.all(IMAGE_CACHE_KEYS.map((key) => ImageCache.clear(key)));
    }
}
