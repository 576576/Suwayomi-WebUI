/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { TRACKER_OAUTH_CHANNEL, CAN_BROADCAST_CHANNEL } from '@/features/tracker/Tracker.constants.ts';

/** 告诉打开弹窗的那个窗口「认证结束了」，好让它刷新追踪器列表。 */
const notifyOpenedFrom = (trackerId: number) => {
    if (CAN_BROADCAST_CHANNEL) {
        const channel = new BroadcastChannel(TRACKER_OAUTH_CHANNEL);
        channel.postMessage({ trackerId });
        channel.close();
        return;
    }

    window.opener?.postMessage({ type: TRACKER_OAUTH_CHANNEL, trackerId }, window.location.origin);
};

export const TrackerOAuthLogin = () => {
    const { t } = useLingui();
    const navigate = useNavigate();

    const url = new URL(window.location.href);
    const { trackerId, trackerName, popup }: { trackerId: number; trackerName: string; popup?: boolean } = JSON.parse(
        url.searchParams.get('state') ?? '{}',
    );

    useEffect(() => {
        const login = async () => {
            try {
                await requestManager.loginToTrackerOauth(trackerId, window.location.href).response;
            } catch (e) {
                makeToast(t`Could not log in to ${trackerName}`, 'error', getErrorMessage(e));
            }

            // 弹窗里跑完就通知主窗口并自关；主窗口里（同窗口跳转那条路）没有 opener，
            // 照旧跳回追踪设置页。
            if (popup) {
                notifyOpenedFrom(trackerId);
                window.close();
                return;
            }

            navigate(AppRoutes.settings.children.tracking.path, { replace: true });
        };

        login();
    }, [trackerId]);

    return t`Logging in to ${trackerName}…`;
};
