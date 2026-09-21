/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from 'react';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { SettingsTrackerCard } from '@/features/tracker/components/cards/SettingsTrackerCard.tsx';
import {
    createUpdateMetadataServerSettings,
    useMetadataServerSettings,
} from '@/features/settings/services/ServerSettingsMetadata.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { GET_TRACKERS_SETTINGS } from '@/lib/graphql/tracker/TrackerQuery.ts';
import { TRACKER_OAUTH_CHANNEL, CAN_BROADCAST_CHANNEL } from '@/features/tracker/Tracker.constants.ts';
import type { GetTrackersSettingsQuery } from '@/lib/graphql/generated/graphql.ts';
import type { MetadataTrackingSettings } from '@/features/tracker/Tracker.types.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { STABLE_EMPTY_ARRAY } from '@/base/Base.constants.ts';

export const TrackingSettings = () => {
    const { t } = useLingui();

    useAppTitle(t`Tracking`);

    const {
        settings: { updateProgressAfterReading, updateProgressManualMarkRead },
        loading: areMetadataServerSettingsLoading,
        request: { error: metadataServerSettingsError, refetch: refetchServerMetadataSettings },
    } = useMetadataServerSettings();
    const updateTrackingSettings = createUpdateMetadataServerSettings<keyof MetadataTrackingSettings>((e) =>
        makeToast(t`Failed to save changes`, 'error', getErrorMessage(e)),
    );

    const {
        data,
        loading: areTrackersLoading,
        error: trackersError,
        refetch: refetchTrackersList,
    } = requestManager.useGetTrackerList<GetTrackersSettingsQuery>(GET_TRACKERS_SETTINGS);
    const trackers = data?.trackers.nodes ?? STABLE_EMPTY_ARRAY;

    const refreshTrackers = useCallback(
        () => void refetchTrackersList().catch(defaultPromiseErrorHandler('TrackingSettings::refetchTrackersList')),
        [refetchTrackersList],
    );

    // 弹窗认证（宿主的新窗口）在主窗口之外完成登录，登录态是从服务端读的 ——
    // 不重新拉一次，卡片会一直显示成未登录。
    useEffect(() => {
        if (CAN_BROADCAST_CHANNEL) {
            const channel = new BroadcastChannel(TRACKER_OAUTH_CHANNEL);
            channel.onmessage = refreshTrackers;
            return () => channel.close();
        }

        window.addEventListener('message', refreshTrackers);
        return () => window.removeEventListener('message', refreshTrackers);
    }, [refreshTrackers]);

    const loading = areMetadataServerSettingsLoading || areTrackersLoading;
    const error = metadataServerSettingsError ?? trackersError;

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => {
                    if (metadataServerSettingsError) {
                        refetchServerMetadataSettings().catch(
                            defaultPromiseErrorHandler('TrackingSettings::refetchMetadataServerSettings'),
                        );
                    }

                    if (trackersError) {
                        refetchTrackersList().catch(
                            defaultPromiseErrorHandler('TrackingSettings::refetchTrackersList'),
                        );
                    }
                }}
            />
        );
    }

    if (loading) {
        return <LoadingPlaceholder />;
    }

    return (
        <>
            <List sx={{ pt: 0 }}>
                <ListItem>
                    <ListItemText primary={t`Update progress after reading`} />
                    <Switch
                        edge="end"
                        checked={updateProgressAfterReading}
                        onChange={(e) => updateTrackingSettings('updateProgressAfterReading', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Update progress after manually marking as read`}
                        secondary={t`Does not work when marking multiple manga as read at once`}
                    />
                    <Switch
                        edge="end"
                        checked={updateProgressManualMarkRead}
                        onChange={(e) => updateTrackingSettings('updateProgressManualMarkRead', e.target.checked)}
                    />
                </ListItem>
            </List>
            <List
                subheader={
                    <ListSubheader component="div" id="tracking-trackers">
                        {t`Trackers`}
                    </ListSubheader>
                }
            >
                {trackers.map((tracker) => (
                    <SettingsTrackerCard key={tracker.id} tracker={tracker} onTrackerUpdated={refreshTrackers} />
                ))}
            </List>
        </>
    );
};
