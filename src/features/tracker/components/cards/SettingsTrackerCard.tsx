/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLingui } from '@lingui/react/macro';
import { makeToast } from '@/base/utils/Toast.ts';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { Trackers } from '@/features/tracker/services/Trackers.ts';
import { getErrorMessage, noOp } from '@/lib/HelperFunctions.ts';
import type { TTrackerSearch } from '@/features/tracker/Tracker.types.ts';
import { AvatarSpinner } from '@/base/components/AvatarSpinner.tsx';
import { CredentialsLogin } from '@/base/components/modals/LoginDialog.tsx';
import { TrackerOAuthAppDialog } from '@/features/tracker/components/TrackerOAuthAppDialog.tsx';

export const SettingsTrackerCard = ({
    tracker,
    onTrackerUpdated,
}: {
    tracker: TTrackerSearch;
    onTrackerUpdated: () => void;
}) => {
    const { t } = useLingui();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isOAuthLogin = !tracker.isLoggedIn && !!tracker.authUrl;

    /**
     * 打开站点授权页 —— 一律走新窗口：宿主（桌面托盘、Android 应用）把它开成应用内的窗口，
     * 浏览器里是新标签页。回调页登完后会通知本窗口刷新并自关（靠 `state.popup` 认路）。
     *
     * 新窗口被拦下来（弹窗拦截、宿主不支持）才退回同窗口跳转 —— 那条路上回调页没有 opener，
     * 自己跳回追踪设置页。
     */
    const openTrackerOAuth = () => {
        const state = {
            redirectUrl: `${window.location.origin}/tracker/login/oauth`,
            clientName: 'Suwayomi-WebUI',
            trackerId: tracker.id,
            trackerName: tracker.name,
        };
        const url = (popup: boolean) => `${tracker.authUrl}&state=${JSON.stringify({ ...state, popup })}`;

        if (window.open(url(true), '_blank')) {
            return;
        }

        window.location.href = url(false);
    };

    const handleRefreshUser = async (event: React.MouseEvent) => {
        // 卡片本身点击是登录/登出，刷新按钮不能顺带触发它。
        event.stopPropagation();

        setIsRefreshing(true);
        try {
            await requestManager.refreshTrackerUser(tracker.id).response;
        } catch (e) {
            makeToast(t`Could not refresh ${tracker.name}`, 'error', getErrorMessage(e));
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleLogout = async () => {
        try {
            await requestManager.logoutFromTracker(tracker.id).response;
        } catch (e) {
            makeToast(t`Could not log out from ${tracker.name}`, 'error', getErrorMessage(e));
        }
    };

    const handleLogin = async (username: string, password: string) => {
        if (isOAuthLogin) {
            openTrackerOAuth();
            return;
        }

        try {
            await requestManager.loginTrackerCredentials(tracker.id, username, password).response;
        } catch (e) {
            makeToast(t`Could not log in to ${tracker.name}`, 'error', getErrorMessage(e));
        }
    };

    const login = async (initialUsername?: string, initialPassword?: string) => {
        if (isOAuthLogin) {
            openTrackerOAuth();
            return;
        }

        const controlled = CredentialsLogin.showControlled(
            {
                title: Trackers.isLoggedIn(tracker) ? t`Log out from ${tracker.name}` : t`Log in to ${tracker.name}`,
                isLoading: false,
                isLoggedIn: Trackers.isLoggedIn(tracker),
                username: initialUsername,
                password: initialPassword,
                loginLogout: async (username, password) => {
                    controlled.update({
                        isLoading: true,
                        loginLogout: noOp,
                    });

                    if (Trackers.isLoggedIn(tracker)) {
                        try {
                            await handleLogout();

                            controlled.submit();
                        } catch (e) {
                            makeToast(t`Could not log out from ${tracker.name}`, 'error', getErrorMessage(e));
                        }

                        return;
                    }

                    try {
                        await handleLogin(username, password);

                        controlled.submit();
                    } catch (e) {
                        makeToast(t`Could not log in to ${tracker.name}`, 'error', getErrorMessage(e));

                        const RETRY_KEY = '__retry__';
                        const retry = await Promise.race([controlled.promise, Promise.resolve(RETRY_KEY)]);
                        if (retry === RETRY_KEY) {
                            login(username, password);
                        }
                    }
                },
            },
            { id: 'tracker-login-dialog' },
        );

        await controlled.promise;
    };

    return (
        <ListItem
            disablePadding
            // 齿轮/刷新这些按钮必须与整行按钮**并列**（挂在 ListItem 的 secondaryAction 上）：
            // 塞进 ListItemButton 里的话外层按钮会把点击接管掉，齿轮点了等于点了整行。
            secondaryAction={
                <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                    {Trackers.isLoggedIn(tracker) && (
                        <>
                            <Chip label={t`Logged in`} color="success" />
                            <Tooltip title={t`Refresh user settings`}>
                                <IconButton onClick={handleRefreshUser} disabled={isRefreshing} size="small">
                                    {isRefreshing ? <CircularProgress size={18} /> : <RefreshIcon />}
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                    {/* 齿轮固定在最右：登录态多出来的刷新按钮与「已登录」标签不能把它挤到左边。 */}
                    <Tooltip title={t`App credentials`}>
                        <IconButton
                            aria-label={t`App credentials`}
                            onClick={() => {
                                TrackerOAuthAppDialog.show({ tracker, onSaved: onTrackerUpdated }).catch(noOp);
                            }}
                            size="small"
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            }
        >
            <ListItemButton onClick={() => login()}>
                <ListItemAvatar sx={{ paddingRight: '20px' }}>
                    <AvatarSpinner
                        alt={`${tracker.name}`}
                        iconUrl={requestManager.getValidImgUrlFor(tracker.icon)}
                        slots={{
                            avatarProps: {
                                variant: 'rounded',
                                sx: { width: 64, height: 64 },
                            },
                            spinnerImageProps: {
                                ignoreQueue: true,
                            },
                        }}
                    />
                </ListItemAvatar>
                <ListItemText primary={tracker.name} />
            </ListItemButton>
        </ListItem>
    );
};
