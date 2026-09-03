/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import useMediaQuery from '@mui/material/useMediaQuery';
import type { Breakpoint, SxProps, Theme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { getCurrentTheme } from '@/features/theme/services/ThemeCreator.ts';
import { useResizeObserver } from '@/base/hooks/useResizeObserver.tsx';
import { ThemeMode } from '@/features/theme/AppTheme.types.ts';

export class MediaQuery {
    static readonly MOBILE_WIDTH: Breakpoint | number = 'sm';

    static readonly TABLET_WIDTH: Breakpoint | number = 1025;

    static isTouchDevice(): boolean {
        return window.matchMedia('not (pointer: fine)').matches;
    }

    static useIsTouchDevice(): boolean {
        return useMediaQuery('not (pointer: fine)');
    }

    static useIsBelowWidth(breakpoint: Breakpoint | number): boolean {
        return useMediaQuery(getCurrentTheme().breakpoints.down(breakpoint));
    }

    static useIsMobileWidth(): boolean {
        return this.useIsBelowWidth(this.MOBILE_WIDTH);
    }

    static useIsTabletWidth(): boolean {
        return this.useIsBelowWidth(this.TABLET_WIDTH);
    }

    /**
     * 量出系统滚动条占多少布局空间：造一个 `overflow: scroll` 的隐藏 div，
     * 内部再套一个 100% 尺寸的子元素，两者的 offset 差即为滚动条尺寸。
     *
     * 覆盖式滚动条（overlay scrollbars，macOS / 多数移动端默认）不占布局空间，
     * 返回 0。
     */
    static getScrollbarSize(type: 'height' | 'width' = 'width'): number {
        const outer = document.createElement('div');
        outer.style.position = 'absolute';
        outer.style.top = '-9999px';
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '100%';
        outer.appendChild(inner);

        const width = outer.offsetWidth - inner.offsetWidth;
        const height = outer.offsetHeight - inner.offsetHeight;

        document.body.removeChild(outer);

        return type === 'height' ? height : width;
    }

    /**
     * 经典滚动条的尺寸，与元素**当前**有没有滚动条无关。
     *
     * 与 `useGetScrollbarSize` 的区别：后者只在目标元素此刻确实出现滚动条时才返回
     * 非零值；而 `scrollbar-gutter: stable` 是**恒定**预留槽位（滚不滚都占着），
     * 要抵消它就必须无条件测量 —— 元素当前没滚动时 useGetScrollbarSize 只会给 0。
     */
    static useGetClassicScrollbarSize(type: 'height' | 'width' = 'width'): number {
        const [scrollbarSize, setScrollbarSize] = useState(() => MediaQuery.getScrollbarSize(type));

        useEffect(() => {
            // 系统缩放 / 滚动条设置变化会改变这个宽度，跟一次 resize
            const remeasure = () => setScrollbarSize(MediaQuery.getScrollbarSize(type));
            window.addEventListener('resize', remeasure);
            return () => window.removeEventListener('resize', remeasure);
        }, [type]);

        return scrollbarSize;
    }

    static useGetScrollbarSize(
        type: 'height' | 'width',
        element: HTMLElement | null = document.documentElement,
    ): number {
        const [scrollbarSize, setScrollbarSize] = useState(0);

        useResizeObserver(
            element,
            useCallback(() => {
                const hasYScrollbar = !!(element!.scrollHeight - element!.clientHeight);
                const hasXScrollbar = !!(element!.scrollWidth - element!.clientWidth);

                const hasScrollbar = (type === 'height' && hasYScrollbar) || (type === 'width' && hasXScrollbar);
                if (hasScrollbar) {
                    setScrollbarSize(this.getScrollbarSize(type));
                    return;
                }

                setScrollbarSize(0);
            }, [element]),
        );

        return scrollbarSize;
    }

    static getSystemThemeMode(): Exclude<ThemeMode, 'system'> {
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;
    }

    static getThemeMode(themeMode: ThemeMode): Exclude<ThemeMode, 'system'> {
        const isSystemMode = themeMode === ThemeMode.SYSTEM;
        if (isSystemMode) {
            return this.getSystemThemeMode();
        }

        return themeMode;
    }

    static listenToSystemThemeChange(onChange: (themeMode: Exclude<ThemeMode, 'system'>) => void): () => void {
        const handleSystemThemeModeChange = (e: MediaQueryListEvent) => {
            onChange(e.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
        };

        const matchSystemThemeMode = window.matchMedia('(prefers-color-scheme: dark)');

        matchSystemThemeMode.addEventListener('change', handleSystemThemeModeChange);

        return () => matchSystemThemeMode.removeEventListener('change', handleSystemThemeModeChange);
    }

    static usePreventMobileContextMenu() {
        const isTouchDevice = MediaQuery.useIsTouchDevice();

        return useCallback(
            (e: React.MouseEvent<any, MouseEvent>) => {
                if (isTouchDevice) {
                    e.preventDefault();
                }
            },
            [isTouchDevice],
        );
    }

    static preventMobileContextMenuSx(): SxProps<Theme> {
        return {
            userSelect: 'none',
            '-webkit-touch-callout': 'none',
        };
    }
}
