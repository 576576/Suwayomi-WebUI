/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { useLingui } from '@lingui/react/macro';
import { useMetadataServerSettings } from '@/features/settings/services/ServerSettingsMetadata.ts';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { ListItemLink } from '@/base/components/lists/ListItemLink.tsx';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { DebugInformation } from '@/features/settings/components/DebugInformation.tsx';
import { DeviceSetting } from '@/features/device/screens/DeviceSetting.tsx';
import Stack from '@mui/material/Stack';

export const AdvancedSettings = () => {
    const { t } = useLingui();

    useAppTitle(t`Advanced`);

    const {
        request: { loading, error, refetch },
    } = useMetadataServerSettings();

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
                <ListItemLink to={AppRoutes.settings.children.advanced.children.server.path}>
                    <ListItemText primary={t`Server settings`} />
                </ListItemLink>
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
