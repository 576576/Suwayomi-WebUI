/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * Android 宿主注入的原生桥（`window.SuwayomiAndroid`，Kotlin 侧见
 * `android/app/src/main/kotlin/org/suwayomi/next/MainActivity.kt` 的 `Bridge`）。
 *
 * 只有 Android 宿主的 WebView 里有它；浏览器里、桌面端起服务再看网页时都没有 ——
 * 调用方据此决定是「唤起系统目录授权」还是「弹文本对话框」。Android 上的目录是
 * **服务端**在写（同进程的 Rust 库，普通文件系统调用），能写哪个目录由「所有文件
 * 访问」+ SAF 授权决定，手填路径不成立。
 */

type PickDirectoryResult = {
    /** 用户选定的真实路径；取消时为空。 */
    path?: string;
    /** 失败原因（权限、目录不可写、SAF provider 不是本机存储……）。 */
    error?: string;
};

type AndroidBridge = {
    platform(): string;
    pickDirectory(requestId: string, initial: string): void;
};

declare global {
    interface Window {
        /** Kotlin 侧回话用的钩子（名字与 MainActivity.replyPickResult 对应）。 */
        __suwayomiPickDirectory?: (requestId: string, path: string, error: string) => void;
    }
}

const getBridge = (): AndroidBridge | undefined => (window as { SuwayomiAndroid?: AndroidBridge }).SuwayomiAndroid;

/** 是否跑在 Android 宿主里（决定路径项「点铅笔」是开系统对话框还是文本对话框）。 */
export const isAndroidApp = (): boolean => getBridge() !== undefined;

let requestSeq = 0;
const pendingRequests = new Map<string, (result: PickDirectoryResult) => void>();

window.__suwayomiPickDirectory = (requestId, path, error) => {
    const resolve = pendingRequests.get(requestId);
    if (!resolve) {
        return;
    }

    pendingRequests.delete(requestId);
    resolve({ path: path || undefined, error: error || undefined });
};

/** 唤起系统的「使用此文件夹」授权对话框；`initialPath` 只是给个起点，用户可以随便选。 */
export const pickDirectory = (initialPath: string): Promise<PickDirectoryResult> => {
    const bridge = getBridge();
    if (!bridge) {
        return Promise.resolve({ error: 'not running inside the Android app' });
    }

    return new Promise((resolve) => {
        const requestId = String(++requestSeq);
        pendingRequests.set(requestId, resolve);
        bridge.pickDirectory(requestId, initialPath);
    });
};
