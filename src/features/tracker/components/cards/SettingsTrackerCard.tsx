/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLingui } from '@lingui/react/macro';
import { makeToast } from '@/base/utils/Toast.ts';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { Trackers } from '@/features/tracker/services/Trackers.ts';
import { getErrorMessage, noOp } from '@/lib/HelperFunctions.ts';
import type { TTrackerSearch } from '@/features/tracker/Tracker.types.ts';
import { AvatarSpinner } from '@/base/components/AvatarSpinner.tsx';
import { CredentialsLogin } from '@/base/components/modals/LoginDialog.tsx';

export const SettingsTrackerCard = ({ tracker }: { tracker: TTrackerSearch }) => {
    const { t } = useLingui();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isOAuthLogin = !tracker.isLoggedIn && !!tracker.authUrl;

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
            const state = {
                redirectUrl: `${window.location.origin}/tracker/login/oauth`,
                clientName: 'Suwayomi-WebUI',
                trackerId: tracker.id,
                trackerName: tracker.name,
            };

            window.open(`${tracker.authUrl}&state=${JSON.stringify(state)}`, '_self');
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
            const state = {
                redirectUrl: `${window.location.origin}/tracker/login/oauth`,
                clientName: 'Suwayomi-WebUI',
                trackerId: tracker.id,
                trackerName: tracker.name,
            };

            window.open(`${tracker.authUrl}&state=${JSON.stringify(state)}`, '_self');
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
            {Trackers.isLoggedIn(tracker) && (
                <ListItemSecondaryAction>
                    <Stack sx={{ flexDirection: 'row', gap: 1, alignItems: 'center' }}>
                        <Tooltip title={t`Refresh user settings`}>
                            <IconButton onClick={handleRefreshUser} disabled={isRefreshing} size="small">
                                {isRefreshing ? <CircularProgress size={18} /> : <RefreshIcon />}
                            </IconButton>
                        </Tooltip>
                        <Chip label={t`Logged in`} color="success" />
                    </Stack>
                </ListItemSecondaryAction>
            )}
        </ListItemButton>
    );
};
