/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { ListItemLink } from '@/base/components/lists/ListItemLink.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { VersionInfo } from '@/features/app-updates/components/VersionInfo.tsx';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { epochToDate } from '@/base/utils/DateHelper.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import {
    createUpdateMetadataServerSettings,
    useMetadataServerSettings,
} from '@/features/settings/services/ServerSettingsMetadata.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import type { MetadataServerSettingKeys } from '@/features/settings/Settings.types.ts';

export function About() {
    const { t } = useLingui();

    useAppTitle(t`About`);

    const { data, loading, error, refetch } = requestManager.useGetAbout();

    const {
        data: serverUpdateCheckData,
        loading: isCheckingForServerUpdate,
        refetch: checkForServerUpdate,
        error: serverUpdateCheckError,
    } = requestManager.useCheckForServerUpdate();
    const {
        data: webUIUpdateData,
        loading: isCheckingForWebUIUpdate,
        refetch: checkForWebUIUpdate,
        error: orgWebUIUpdateCheckError,
    } = requestManager.useCheckForWebUIUpdate();
    const webUIUpdateCheckError = orgWebUIUpdateCheckError || webUIUpdateData?.checkForWebUIUpdate.tag === '';

    const {
        settings: { informAboutUpdates },
    } = useMetadataServerSettings();
    const updateMetadataServerSettings = createUpdateMetadataServerSettings<MetadataServerSettingKeys>((e) =>
        makeToast(t`Failed to save changes`, 'error', getErrorMessage(e)),
    );

    if (loading) {
        return <LoadingPlaceholder />;
    }

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('About::refetch'))}
            />
        );
    }

    const { aboutServer, aboutWebUI } = data!;
    const selectedServerChannelInfo = serverUpdateCheckData?.checkForServerUpdates?.find(
        (channel) => channel.channel === aboutServer.buildType,
    );
    const isServerUpdateAvailable =
        !!selectedServerChannelInfo?.tag && selectedServerChannelInfo.tag !== aboutServer.version;
    const isWebUIUpdateAvailable = !!webUIUpdateData?.checkForWebUIUpdate.updateAvailable;

    return (
        <List sx={{ pt: 0 }}>
            {/* 更新提示是全局开关（同时管 server 与 WebUI 两个更新检查），放在最顶上
                而不是塞在 WebUI 段里，免得被误读成只影响 WebUI。 */}
            <ListItem>
                <ListItemText primary={t`Inform about updates`} />
                <Switch
                    edge="end"
                    checked={informAboutUpdates}
                    onChange={() => updateMetadataServerSettings('informAboutUpdates', !informAboutUpdates)}
                />
            </ListItem>
            <Divider />
            <List
                sx={{ padding: 0 }}
                subheader={
                    <ListSubheader component="div" id="about-server-info">
                        {t`Server`}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText primary={t`Server`} secondary={`${aboutServer.name} (${aboutServer.buildType})`} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Server version`}
                        secondary={
                            <VersionInfo
                                version={aboutServer.version}
                                isCheckingForUpdate={isCheckingForServerUpdate}
                                isUpdateAvailable={isServerUpdateAvailable}
                                updateCheckError={serverUpdateCheckError}
                                checkForUpdate={checkForServerUpdate}
                                downloadAsLink
                                url="https://github.com/576576/Suwayomi-next/releases"
                            />
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Build time`}
                        secondary={epochToDate(Number(aboutServer.buildTime)).toISOString()}
                    />
                </ListItem>
            </List>
            <Divider />
            <List
                sx={{ padding: 0 }}
                subheader={
                    <ListSubheader component="div" id="about-webui-info">
                        {t`WebUI`}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText primary={t`WebUI channel`} secondary={aboutWebUI.channel.toLocaleUpperCase()} />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`WebUI version`}
                        secondary={
                            <VersionInfo
                                version={aboutWebUI.tag}
                                isCheckingForUpdate={isCheckingForWebUIUpdate}
                                isUpdateAvailable={isWebUIUpdateAvailable}
                                updateCheckError={webUIUpdateCheckError}
                                checkForUpdate={checkForWebUIUpdate}
                                downloadAsLink
                                url="https://github.com/576576/Suwayomi-WebUI/releases"
                            />
                        }
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Build time`}
                        secondary={
                            Number(aboutWebUI.buildTime) > 0
                                ? epochToDate(Number(aboutWebUI.buildTime)).toISOString()
                                : 'n/a'
                        }
                    />
                </ListItem>
            </List>
            <Divider />
            <List
                subheader={
                    <ListSubheader component="div" id="about-links">
                        {t`Links`}
                    </ListSubheader>
                }
            >
                <ListItemLink to="https://github.com/Suwayomi" target="_blank" rel="noreferrer">
                    <ListItemText primary={t`GitHub Project`} secondary="https://github.com/Suwayomi" />
                </ListItemLink>
                <ListItemLink to={aboutServer.github} target="_blank" rel="noreferrer">
                    <ListItemText primary={t`GitHub Repo`} secondary={aboutServer.github} />
                </ListItemLink>
                <ListItemLink to="https://github.com/576576/Suwayomi-WebUI" target="_blank" rel="noreferrer">
                    <ListItemText primary={t`GitHub WebUI`} secondary="https://github.com/576576/Suwayomi-WebUI" />
                </ListItemLink>
                <ListItemLink to={aboutServer.discord} target="_blank" rel="noreferrer">
                    <ListItemText primary={t`QQ Group`} secondary={aboutServer.discord} />
                </ListItemLink>
                <ListItemLink to={AppRoutes.about.children.licenses.path}>
                    <ListItemText primary={t`Open source licenses`} />
                </ListItemLink>
            </List>
        </List>
    );
}
