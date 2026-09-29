/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export type SaveFileResult = 'saved' | 'cancelled' | 'unsupported';

/**
 * File System Access API（Chromium 系才有）。`lib.dom` 带了这个 API 的
 * `FileSystemFileHandle` 等类型，但没有 `Window` 上的这个入口，只能自己声明。
 */
declare global {
    interface Window {
        showSaveFilePicker?: (options: { suggestedName?: string }) => Promise<FileSystemFileHandle>;
    }
}

/**
 * 唤起系统的「另存为」对话框，把 `load()` 取到的数据写进用户选定的文件。
 *
 * 浏览器只允许在用户手势的瞬态激活窗口内弹这个对话框，所以顺序必须是
 * 「先弹框、再取数据」；反过来的话取数据的耗时会耗掉激活窗口，弹框抛
 * SecurityError。取数据作为回调传进来，调用方就没法把顺序写反。
 *
 * `'unsupported'`（当前环境没有该 API：非安全上下文、Firefox/Safari、
 * Android WebView）与 `'cancelled'`（用户关掉了对话框）都交给调用方决定
 * 后续动作；其余异常原样抛给调用方。
 */
export const saveFileAs = async (suggestedName: string, load: () => Promise<Blob>): Promise<SaveFileResult> => {
    // 拆开取会丢掉接收者，这里显式绑回 window
    const showSaveFilePicker = window.showSaveFilePicker?.bind(window);
    if (!showSaveFilePicker) {
        return 'unsupported';
    }

    let handle: FileSystemFileHandle;
    try {
        handle = await showSaveFilePicker({ suggestedName });
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            return 'cancelled';
        }
        throw error;
    }

    const writable = await handle.createWritable();
    try {
        await writable.write(await load());
        await writable.close();
    } catch (error) {
        await writable.abort().catch(() => undefined);
        throw error;
    }

    return 'saved';
};
