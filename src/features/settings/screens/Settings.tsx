/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import List from '@mui/material/List';
import StorageIcon from '@mui/icons-material/Storage';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CollectionsOutlinedBookmarkIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SyncIcon from '@mui/icons-material/Sync';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { ListItemLink } from '@/base/components/lists/ListItemLink.tsx';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { useNavBarContext } from '@/features/navigation-bar/NavbarContext.tsx';
import { ScrollHostProvider } from '@/base/contexts/ScrollHost.tsx';
import { MediaQuery } from '@/base/utils/MediaQuery.tsx';

export function SettingsMenu() {
    const { t } = useLingui();
    const { pathname } = useLocation();

    const items = [
        { to: AppRoutes.settings.children.appearance.path, icon: <PaletteIcon />, label: t`Appearance` },
        { to: AppRoutes.settings.children.library.path, icon: <CollectionsOutlinedBookmarkIcon />, label: t`Library` },
        { to: AppRoutes.settings.children.reader.path, icon: <AutoStoriesIcon />, label: t`Reader` },
        { to: AppRoutes.settings.children.download.path, icon: <GetAppOutlinedIcon />, label: t`Downloads` },
        { to: AppRoutes.settings.children.tracking.path, icon: <SyncIcon />, label: t`Tracking` },
        { to: AppRoutes.settings.children.browse.path, icon: <ExploreOutlinedIcon />, label: t`Browse` },
        { to: AppRoutes.settings.children.backup.path, icon: <StorageIcon />, label: t`Data & Storage` },
        { to: AppRoutes.settings.children.advanced.path, icon: <SettingsEthernetIcon />, label: t`Advanced` },
    ];

    return (
        <List sx={{ padding: 0 }}>
            {items.map((item) => (
                <ListItemLink key={item.to} to={item.to} selected={pathname.startsWith(item.to)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                </ListItemLink>
            ))}
        </List>
    );
}

/**
 * `/settings` index: 移动端显示菜单列表；宽屏时重定向到第一个设置页
 * （双栏布局下菜单固定显示在左侧）。
 */
export function SettingsIndex() {
    const isWide = useMediaQuery('(min-width:900px)');
    const navigate = useNavigate();

    useEffect(() => {
        if (isWide) {
            navigate(AppRoutes.settings.children.appearance.path, { replace: true });
        }
    }, [isWide, navigate]);

    if (isWide) {
        return null;
    }
    return <SettingsMenu />;
}

/**
 * 设置页布局：宽屏（≥900px）左侧固定菜单 + 右侧内容区；
 * 移动端仅渲染子页面内容（/settings 由 SettingsIndex 提供菜单）。
 */
export function Settings() {
    const { t } = useLingui();
    const isWide = useMediaQuery('(min-width:900px)');
    const { appBarHeight, bottomBarHeight } = useNavBarContext();

    // The settings content pane is its own scroll container: nested pages (e.g. the
    // extension store list) must scroll with it instead of the main scroll host.
    const [settingsScrollHost, setSettingsScrollHost] = useState<HTMLElement | null>(null);

    // #appMainContainer 带 `scrollbar-gutter: stable` —— 它**恒定**预留一条滚动条
    // 槽位（不管此刻滚不滚），而设置页把滚动接管到了右栏，父级那条槽位就成了纯浪费：
    // 右栏滚动条右边空出约 15px 死区。用等量负外边距把布局推回槽位里，让右栏滚动条
    // 贴住窗口右边缘。覆盖式滚动条（macOS / 移动端）宽度为 0，负边距自动归零。
    //
    // 注意不能直接用 useGetScrollbarSize：它只在元素**当前**出现滚动条时才返回非零值，
    // 而槽位是无条件预留的，元素没滚动时那个 hook 会给 0。
    const scrollbarWidth = MediaQuery.useGetClassicScrollbarSize('width');

    useAppTitle(t`Settings`);

    if (!isWide) {
        return <Outlet />;
    }

    return (
        <Box
            sx={{
                display: 'flex',
                // 用视口高度减去顶栏/底栏来限定内容区实际高度。父级
                // (#appMainContainer) 只设置了 minHeight 而没有定高，
                // 因此 height:'100%' 会退化为 auto —— 左右两栏无法在内部
                // 滚动，整页变成文档滚动：滚动右侧时左侧菜单被一起带跑，
                // 窗口滚动条也会贯穿顶栏区域。
                height: `calc(100vh - ${appBarHeight + bottomBarHeight}px)`,
                overflow: 'hidden',
                // 吃掉 #appMainContainer 预留的滚动条槽位，否则右栏滚动条与窗口右边缘
                // 之间会空出一条死区（见上方 scrollbarWidth 的注释）。
                // 槽位位于 padding box 之内，所以负边距不会被 overflow 裁掉；
                // 若父级有 pr: env(safe-area-inset-right)，负边距也恰好只补到安全区内边缘。
                mr: `${-scrollbarWidth}px`,
            }}
        >
            <Box
                sx={{
                    width: 280,
                    flexShrink: 0,
                    overflowY: 'auto',
                    borderRight: 1,
                    borderColor: 'divider',
                    minHeight: 0,
                }}
            >
                <SettingsMenu />
            </Box>
            <Box
                ref={(el: HTMLDivElement | null) => {
                    if (el && !settingsScrollHost) {
                        setSettingsScrollHost(el);
                    }
                }}
                sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}
            >
                {settingsScrollHost ? (
                    <ScrollHostProvider value={settingsScrollHost}>
                        <Outlet />
                    </ScrollHostProvider>
                ) : null}
            </Box>
        </Box>
    );
}
