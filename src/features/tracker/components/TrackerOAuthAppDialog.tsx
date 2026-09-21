/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AwaitableComponent } from 'awaitable-component';
import type { AwaitableComponentProps } from 'awaitable-component';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { TRACKER_OAUTH_APPS } from '@/lib/graphql/tracker/TrackerQuery.ts';
import type { TrackerOAuthAppsQuery } from '@/lib/graphql/tracker/TrackerExtensions.ts';
import type { TTrackerSearch } from '@/features/tracker/Tracker.types.ts';

/**
 * 站点的 OAuth 应用凭据（`trackers.json`）：换成自己注册的应用时填这里。留空 = 回到内置默认值。
 * 站点用不到的字段（如 AniList 没有 client secret）不显示。
 *
 * 走 `AwaitableComponent`（挂在 App 根，见 `App.tsx` 的 `<AwaitableComponent.Root />`）而不是
 * 卡片里自己的 `useState`：进设置页后点这些按钮会让列表整片重挂载，卡片里的 state 会被重置，
 * 对话框就永远打不开了。
 */
const TrackerOAuthAppDialogComponent = ({
    isVisible,
    onExitComplete,
    onSubmit,
    onDismiss,
    tracker,
    onSaved,
}: AwaitableComponentProps<void> & {
    tracker: TTrackerSearch;
    onSaved: () => void;
}) => {
    const { t } = useLingui();

    const { data, loading, error, refetch } =
        requestManager.useGetTrackerList<TrackerOAuthAppsQuery>(TRACKER_OAUTH_APPS);
    const oauthApp = data?.trackers.nodes.find((node) => node.id === tracker.id)?.oauthApp;

    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [redirectUri, setRedirectUri] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // 拿到的当前值只灌一次输入框，之后由用户编辑（重新拉数据不该覆盖他正在改的内容）
    const isInitialized = useRef(false);
    useEffect(() => {
        if (isInitialized.current || !oauthApp) {
            return;
        }

        isInitialized.current = true;
        setClientId(oauthApp.clientId);
        setClientSecret(oauthApp.clientSecret);
        setRedirectUri(oauthApp.redirectUri);
    }, [oauthApp]);

    const showsClientSecret = !!oauthApp?.clientSecret;
    const showsRedirectUri = !!oauthApp?.redirectUri;

    const save = async () => {
        setIsSaving(true);
        try {
            await requestManager.updateTrackerOAuthApp({
                trackerId: tracker.id,
                clientId,
                clientSecret: showsClientSecret ? clientSecret : null,
                redirectUri: showsRedirectUri ? redirectUri : null,
            }).response;

            await refetch();
            onSaved();
            onSubmit();
        } catch (e) {
            makeToast(t`Could not save the app credentials`, 'error', getErrorMessage(e));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog fullWidth maxWidth="xs" open={isVisible} onClose={onDismiss} onTransitionExited={onExitComplete}>
            <DialogTitle>{t`App credentials`}</DialogTitle>
            <DialogContent dividers>
                {loading || error ? (
                    <LoadingPlaceholder />
                ) : (
                    <Stack sx={{ flexDirection: 'column', gap: 2, paddingTop: 1 }}>
                        <TextField
                            label={t`Client ID`}
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        {showsClientSecret && (
                            <TextField
                                label={t`Client secret`}
                                value={clientSecret}
                                onChange={(e) => setClientSecret(e.target.value)}
                                size="small"
                                fullWidth
                            />
                        )}
                        {showsRedirectUri && (
                            <TextField
                                label={t`Redirect URI`}
                                value={redirectUri}
                                onChange={(e) => setRedirectUri(e.target.value)}
                                size="small"
                                fullWidth
                            />
                        )}
                        <Stack
                            sx={{ color: 'text.secondary', fontSize: '0.75rem' }}
                        >{t`Leave empty to use the built-in app`}</Stack>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onDismiss} disabled={isSaving}>
                    {t`Cancel`}
                </Button>
                <Button onClick={save} disabled={isSaving || loading || !!error} variant="contained">
                    {isSaving ? <CircularProgress size={18} /> : t`Save`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const TrackerOAuthAppDialog = AwaitableComponent.create(TrackerOAuthAppDialogComponent);
