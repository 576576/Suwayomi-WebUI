/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useLingui } from '@lingui/react/macro';
import { WebUiChannel } from '@/lib/graphql/generated/graphql-base.types.ts';
import { useLocalStorage } from '@/base/hooks/useStorage.tsx';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { VersionUpdateInfoDialog } from '@/features/app-updates/components/VersionUpdateInfoDialog.tsx';
import { useUpdateChecker } from '@/features/app-updates/hooks/useUpdateChecker.tsx';
import { useMetadataServerSettings } from '@/features/settings/services/ServerSettingsMetadata.ts';
import { noOp } from '@/lib/HelperFunctions.ts';
import { STABLE_EMPTY_OBJECT } from '@/base/Base.constants.ts';
import { AppSession } from '@/base/AppSession.ts';

const disabledUpdateCheck = () => Promise.resolve();

export const WebUIUpdateChecker = () => {
    const { t } = useLingui();

    const [webUIVersion, setWebUIVersion] = useLocalStorage<string>('webUIVersion');
    const [open, setOpen] = useState(false);

    const {
        settings: { informAboutUpdates, checkForUpdatesOnStartup },
        loading: areMetadataServerSettingsLoading,
    } = useMetadataServerSettings();
    const serverSettings = requestManager.useGetServerSettings();
    const isAutoUpdateEnabled = !!serverSettings.data?.settings.webUIUpdateCheckInterval;

    const shouldCheckForUpdate = !isAutoUpdateEnabled && informAboutUpdates;

    const { data: aboutData } = requestManager.useGetAbout();
    const { aboutWebUI } = aboutData ?? STABLE_EMPTY_OBJECT;

    const { data: webUIUpdateData, refetch: checkForUpdate } = requestManager.useCheckForWebUIUpdate({
        fetchPolicy: 'cache-only',
    });

    const updateChecker = useUpdateChecker(
        'webUI',
        shouldCheckForUpdate ? checkForUpdate : disabledUpdateCheck,
        webUIUpdateData?.checkForWebUIUpdate.tag,
        undefined,
        checkForUpdatesOnStartup,
    );

    // 正式产物来自 fork（576576/Suwayomi-WebUI），跳转保持与出包源一致
    const changelogUrl =
        webUIUpdateData?.checkForWebUIUpdate.channel === WebUiChannel.Stable
            ? 'https://github.com/576576/Suwayomi-WebUI/releases/latest'
            : 'https://github.com/576576/Suwayomi-WebUI/blob/master/CHANGELOG.md';

    const newVersion = aboutWebUI?.tag;
    const isSameAsCurrent = !newVersion || !webUIVersion || webUIVersion === newVersion;

    const shouldForceRefresh = AppSession.STARTUP_TIMESTAMP < Number(aboutWebUI?.updateTimestamp);

    const saveInitialVersion = !webUIVersion && !!newVersion;
    if (saveInitialVersion) {
        setWebUIVersion(newVersion);
    }

    if (!areMetadataServerSettingsLoading && !isSameAsCurrent && !open) {
        if (informAboutUpdates) {
            setOpen(true);
        } else {
            setWebUIVersion(newVersion);
        }
    }

    const isUpdateAvailable =
        shouldCheckForUpdate && updateChecker.handleUpdate && webUIUpdateData?.checkForWebUIUpdate.updateAvailable;
    if (isUpdateAvailable) {
        return (
            <VersionUpdateInfoDialog
                info={t`WebUI version ${webUIUpdateData?.checkForWebUIUpdate.tag} (${webUIUpdateData?.checkForWebUIUpdate.channel}) available for download`}
                changelogUrl={changelogUrl}
                onAction={() => window.open(changelogUrl, '_blank', 'noreferrer')}
                actionTitle={t`Update`}
                updateCheckerProps={[
                    'webUI',
                    isAutoUpdateEnabled ? disabledUpdateCheck : checkForUpdate,
                    webUIUpdateData?.checkForWebUIUpdate.tag,
                ]}
            />
        );
    }

    if (!open) {
        return null;
    }

    return (
        <Dialog open={open} onClose={shouldForceRefresh ? () => setOpen(false) : noOp}>
            <DialogTitle>{t`Updated version`}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t`WebUI was updated to version ${newVersion} (${aboutWebUI?.channel})`}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button href={changelogUrl} target="_blank" rel="noreferrer">
                    {t`Changelog`}
                </Button>
                <Button
                    onClick={() => {
                        setWebUIVersion(newVersion);
                        setOpen(false);

                        if (shouldForceRefresh) {
                            window.location.reload();
                        }
                    }}
                    variant="contained"
                >
                    {shouldForceRefresh ? t`Refresh` : t`Ok`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
