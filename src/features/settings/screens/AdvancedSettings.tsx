/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import { useLingui } from '@lingui/react/macro';
import { useMetadataServerSettings } from '@/features/settings/services/ServerSettingsMetadata.ts';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { ListItemLink } from '@/base/components/lists/ListItemLink.tsx';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { ImageCache } from '@/lib/service-worker/ImageCache.ts';
import { DebugInformation } from '@/features/settings/components/DebugInformation.tsx';
import { DeviceSetting } from '@/features/device/screens/DeviceSetting.tsx';
import Stack from '@mui/material/Stack';

export const AdvancedSettings = () => {
    const { t } = useLingui();

    useAppTitle(t`Advanced`);

    const {
        request: { loading, error, refetch },
    } = useMetadataServerSettings();

    const [triggerClearServerCache, { loading: isClearingServerCache }] = requestManager.useClearServerCache();

    const clearCache = async () => {
        try {
            await Promise.all([
                triggerClearServerCache({ variables: { input: { cachedPages: true, cachedThumbnails: true } } }),
                ImageCache.clearAll(),
            ]);
            makeToast(t`Cleared the cache`, 'success');
        } catch (e) {
            makeToast(t`Could not clear the cache`, 'error', getErrorMessage(e));
        }
    };

    if (loading) {
        return <LoadingPlaceholder />;
    }

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('AdvancedSettings::refetch'))}
            />
        );
    }

    return (
        <>
            <List sx={{ pt: 0 }}>
                <ListItemButton disabled={isClearingServerCache} onClick={clearCache}>
                    <ListItemText
                        primary={t`Clear cache`}
                        secondary={t`The cache of the client (browser, electron) should get cleared alongside it, otherwise, the client cache will keep getting used`}
                    />
                </ListItemButton>
                <List
                    subheader={
                        <ListSubheader component="div" id="image-processing-settings">
                            {t`Image processing`}
                        </ListSubheader>
                    }
                >
                    <ListItemLink to={AppRoutes.settings.children.images.children.processingDownloads.path}>
                        <ListItemText primary={t`Image download processing`} />
                    </ListItemLink>
                    <ListItemLink to={AppRoutes.settings.children.images.children.processingServe.path}>
                        <ListItemText primary={t`Image serve processing`} />
                    </ListItemLink>
                </List>
            </List>
            <DeviceSetting />
            <Stack sx={{ px: 2, py: 1 }}>
                <DebugInformation />
            </Stack>
        </>
    );
};
