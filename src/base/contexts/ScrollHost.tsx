/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { createContext, useContext } from 'react';

/**
 * 整个应用采用「顶栏以下唯一滚动容器」模型：#appMainContainer 是页面级滚动宿主，
 * 所有 (window-level 的) Virtuoso 列表都把该容器当作 customScrollParent 来跟踪滚动。
 * 嵌套在自建滚动区（如设置页右侧面板）里的页面，则由内层 Provider 覆盖为面板元素。
 */

let mainScrollHost: HTMLElement | null = null;

export const setMainScrollHost = (el: HTMLElement | null) => {
    mainScrollHost = el;
};

export const scrollMainToTop = () => {
    mainScrollHost?.scrollTo({ top: 0 });
};

const ScrollHostContext = createContext<HTMLElement | null>(null);

export const ScrollHostProvider = ScrollHostContext.Provider;

export const useScrollHost = (): HTMLElement | null => {
    const nestedScrollHost = useContext(ScrollHostContext);

    return nestedScrollHost ?? mainScrollHost;
};
