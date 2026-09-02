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
