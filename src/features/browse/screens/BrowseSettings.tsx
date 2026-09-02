/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import { useLingui } from '@lingui/react/macro';
import { plural } from '@lingui/core/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import {
    createUpdateMetadataServerSettings,
    useMetadataServerSettings,
} from '@/features/settings/services/ServerSettingsMetadata.ts';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import type { MetadataBrowseSettings } from '@/features/browse/Browse.types.ts';
import type { MetadataHistorySettings } from '@/features/history/History.types.ts';
import type { ServerSettings as GqlServerSettings } from '@/features/settings/Settings.types.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ListSubheader from '@mui/material/ListSubheader';
import { ListItemLink } from '@/base/components/lists/ListItemLink.tsx';
import { AppRoutes } from '@/base/AppRoute.constants.ts';

type ExtensionsSettings = Pick<GqlServerSettings, 'maxSourcesInParallel'>;

// ---- Parallel source requests ----
// Discrete steps on a single slider, mirroring the auto-backup frequency
// UI in Data & Storage. Index 0 = unlimited (server stores 0); indices
// 1..=16 map to the number of parallel sources. Dragging updates an
// optimistic local index and persists on release (onChangeCommitted) so the
// thumb doesn't snap back before the server setting round-trips.
const MAX_PARALLEL_SOURCES = 16;

const ParallelSourceRequestsSetting: React.FC<{
    value: number;
    handleChange: (parallelSources: number) => void;
}> = ({ value, handleChange }) => {
    const { t } = useLingui();

    const toIndex = (v: number): number => (v <= 0 ? 0 : Math.min(v, MAX_PARALLEL_SOURCES));
    const [uiIndex, setUiIndex] = useState<number | null>(null);
    useEffect(() => {
        setUiIndex(null);
    }, [value]);
    const shown = uiIndex ?? toIndex(value);
    const display = (idx: number): string =>
        idx === 0 ? t`Unlimited` : plural(idx, { one: '# Source', other: '# Sources' });

    return (
        <ListItemButton sx={{ display: 'block', alignItems: 'center', overflowX: 'hidden' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{t`Parallel source requests`}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {display(shown)}
                </Typography>
            </Stack>
            <Slider
                value={shown}
                min={0}
                max={MAX_PARALLEL_SOURCES}
                step={1}
                valueLabelDisplay="off"
                onChange={(_e, v) => setUiIndex(v as number)}
                onChangeCommitted={(_e, v) => handleChange(v as number)}
            />
        </ListItemButton>
    );
};

export const BrowseSettings = () => {
    const { t } = useLingui();

    useAppTitle(t`Browse`);

    const { data, loading, error, refetch } = requestManager.useGetServerSettings();
    const [mutateSettings] = requestManager.useUpdateServerSettings();
    const extensionStoresRequest = requestManager.useGetExtensionStores();

    const extensionStoreCount = extensionStoresRequest.data?.extensionStores.totalCount;

    const updateSetting = <Setting extends keyof ExtensionsSettings>(
        setting: Setting,
        value: ExtensionsSettings[Setting],
    ) => {
        mutateSettings({ variables: { input: { settings: { [setting]: value } } } }).catch((e) =>
            makeToast(t`Failed to save changes`, 'error', getErrorMessage(e)),
        );
    };

    const {
        settings: { hideLibraryEntries, hideHistory, showNsfw },
    } = useMetadataServerSettings();
    const updateMetadataServerSettings = createUpdateMetadataServerSettings<
        keyof MetadataBrowseSettings | keyof MetadataHistorySettings
    >((e) => makeToast(t`Failed to save changes`, 'error', getErrorMessage(e)));

    if (loading) {
        return <LoadingPlaceholder />;
    }

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('BrowseSettings::refetch'))}
            />
        );
    }

    const serverSettings = data!.settings;

    return (
        <List sx={{ pt: 0 }}>
            <List
                subheader={
                    <ListSubheader component="div" id="browse-settings-source">
                        {t`Sources`}
                    </ListSubheader>
                }
                sx={{ pb: 0 }}
            >
                <ListItem>
                    <ListItemText primary={t`Hide entries already in library`} />
                    <Switch
                        edge="end"
                        checked={hideLibraryEntries}
                        onChange={() => updateMetadataServerSettings('hideLibraryEntries', !hideLibraryEntries)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText primary={t`Hide history`} />
                    <Switch
                        edge="end"
                        checked={hideHistory}
                        onChange={() => updateMetadataServerSettings('hideHistory', !hideHistory)}
                    />
                </ListItem>
                <ParallelSourceRequestsSetting
                    value={serverSettings.maxSourcesInParallel}
                    handleChange={(parallelSources) => updateSetting('maxSourcesInParallel', parallelSources)}
                />
                <ListItemLink to={AppRoutes.settings.children.browse.children.extensionStores.path}>
                    <ListItemText
                        primary={t`Extension stores`}
                        secondary={
                            !!extensionStoreCount &&
                            plural(extensionStoreCount, {
                                one: '# extension store',
                                other: '# extension stores',
                            })
                        }
                    />
                </ListItemLink>
            </List>
            <List
                subheader={
                    <ListSubheader component="div" id="browse-settings-source">
                        {t`NSFW (18+) sources`}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText primary={t`Show in sources and extensions lists`} />
                    <Switch
                        edge="end"
                        checked={showNsfw}
                        onChange={() => updateMetadataServerSettings('showNsfw', !showNsfw)}
                    />
                </ListItem>
                <Stack sx={{ px: 2, gap: 1 }}>
                    <ErrorOutlineOutlinedIcon />
                    <Typography color="textSecondary">{t`This does not prevent unofficial or potentially incorrectly flagged extensions from surfacing NSFW (18+) content within the app.`}</Typography>
                </Stack>
            </List>
        </List>
    );
};
