/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListSubheader from '@mui/material/ListSubheader';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fromEvent } from 'file-selector';
import { useEventListener, useMergedRef, useWindowEvent } from '@mantine/hooks';
import { AwaitableComponent } from 'awaitable-component';
import { useLingui } from '@lingui/react/macro';
import { plural } from '@lingui/core/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { BackupRestoreState } from '@/lib/graphql/generated/graphql-base.types.ts';
import { CircularProgressWithText } from '@/base/components/feedback/CircularProgressWithText.tsx';
import { TextSetting } from '@/base/components/settings/text/TextSetting.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { BackupFlagInclusionDialog } from '@/features/backup/component/BackupFlagInclusionDialog.tsx';
import { BackupValidationDialog } from '@/features/backup/component/BackupValidationDialog.tsx';
import type { BackupSettingsType } from '@/features/backup/Backup.types.ts';
import type { ServerSettings } from '@/features/settings/Settings.types.ts';

let backupRestoreId: string | undefined;

const resetBackupState = () => {
    const input = document.getElementById('backup-file') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
};

// ---- 自动备份频率 ----
// Server stores minutes (0 = disabled). UI slider offers 20 discrete steps:
//   0            = off
//   1..12        = hours (3600..43200)
//   13..18       = days (1..6 * 86400)
//   19           = weekly (604800)
const FREQ_MINUTES = [
    0, 3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800, 32400, 36000, 39600, 43200, 86400, 172800, 259200, 345600,
    432000, 518400, 604800,
];

const AutoBackupFrequencySetting: React.FC<{
    value: number;
    handleChange: (minutes: number) => void;
}> = ({ value, handleChange }) => {
    const { t } = useLingui();

    // nearest step index for the stored minutes
    const findIndex = (minutes: number): number => {
        let best = 0;
        let bestDiff = Infinity;
        FREQ_MINUTES.forEach((m, i) => {
            const diff = Math.abs(m - minutes);
            if (diff < bestDiff) {
                bestDiff = diff;
                best = i;
            }
        });
        return best;
    };

    const step = findIndex(value);

    const display = (idx: number): string => {
        if (idx === 0) {
            return t`Off`;
        }
        if (idx <= 12) {
            return plural(idx, { one: 'Every hour', other: `Every # hours` });
        }
        if (idx <= 18) {
            return plural(idx - 12, { one: 'Every day', other: `Every # days` });
        }
        return t`Every week`;
    };

    return (
        <ListItemButton sx={{ display: 'block', alignItems: 'center' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{t`Auto backup frequency`}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {display(step)}
                </Typography>
            </Stack>
            <Slider
                value={step}
                min={0}
                max={19}
                step={1}
                valueLabelDisplay="off"
                onChange={(_e, v) => handleChange(FREQ_MINUTES[v as number])}
            />
        </ListItemButton>
    );
};

export function Backup() {
    const { t } = useLingui();

    useAppTitle(t`Data & Storage`);

    const { data: settingsData, loading, error, refetch } = requestManager.useGetServerSettings();
    const { data: aboutData } = requestManager.useGetAbout();
    const dataDir = aboutData?.aboutServer.dataDir;
    const [mutateSettings] = requestManager.useUpdateServerSettings();

    const { data } = requestManager.useGetBackupRestoreStatus(backupRestoreId ?? '', {
        skip: !backupRestoreId,
        pollInterval: 1000,
    });

    const [, setTriggerReRender] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const restoreProgress = (() => {
        if (!data?.restoreStatus) {
            return 0;
        }

        const progress = 100 * (data.restoreStatus.mangaProgress / data.restoreStatus.totalManga);
        return Number.isNaN(progress) ? 0 : progress;
    })();

    const updateSetting = <Setting extends keyof BackupSettingsType>(
        setting: Setting,
        value: BackupSettingsType[Setting],
    ) => {
        mutateSettings({ variables: { input: { settings: { [setting]: value } } } }).catch((e) =>
            makeToast(t`Failed to save changes`, 'error', getErrorMessage(e)),
        );
    };

    useEffect(() => {
        if (!data?.restoreStatus) {
            return;
        }

        const isSuccess = data.restoreStatus.state === BackupRestoreState.Success;
        const isFailure = data.restoreStatus.state === BackupRestoreState.Failure;

        const isRestoreFinished = isSuccess || isFailure;
        if (isRestoreFinished) {
            if (isSuccess) {
                makeToast(t`Backup restored.`, 'success');
            }

            if (isFailure) {
                makeToast(t`Could not restore backup`, 'error');
            }

            requestManager.reset();
            backupRestoreId = undefined;
            setTriggerReRender(Date.now());
        }
    }, [data?.restoreStatus?.state]);

    const createBackup = async () => {
        const flags = await AwaitableComponent.show(BackupFlagInclusionDialog, {
            title: t`Create backup`,
        });

        makeToast(t`Creating backup…`, 'info');

        try {
            const backupFileResponse = await requestManager.createBackupFile({ flags }).response;

            const backupFileUrl = backupFileResponse.data?.createBackup.url;
            if (!backupFileUrl) {
                makeToast(t`Could not create backup`, 'error', getErrorMessage(backupFileResponse.error));
                return;
            }

            const link = document.createElement('a');
            link.href = requestManager.getValidUrlFor(backupFileUrl, '');
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            makeToast(t`Could not create backup`, 'error', getErrorMessage(e));
        }
    };

    const validateBackup = async (file: File) => {
        try {
            const validateBackupResponse = await requestManager.validateBackupFile(file, {
                fetchPolicy: 'network-only',
            }).response;
            const validateBackupData = validateBackupResponse.data?.validateBackup;

            if (!validateBackupData) {
                return false;
            }

            if (validateBackupData.missingSources.length || validateBackupData.missingTrackers.length) {
                try {
                    await AwaitableComponent.show(
                        BackupValidationDialog,
                        {
                            validationResult: validateBackupData,
                        },
                        { id: `backup-validate-${file.name}` },
                    );
                } catch (_) {
                    return false;
                }
            }

            return true;
        } catch (e) {
            makeToast(t`Could not validate backup`, 'error', getErrorMessage(e));
        } finally {
            resetBackupState();
        }

        return false;
    };

    const restoreBackup = async (backup: File) => {
        const flags = await AwaitableComponent.show(BackupFlagInclusionDialog, {
            title: t`Restore Backup`,
        });

        try {
            makeToast(t`Restoring backup…`, 'info');

            const response = await requestManager.restoreBackupFile({ backup, flags }).response;
            backupRestoreId = response.data?.restoreBackup.id;
            setTriggerReRender(Date.now());
        } catch (e) {
            makeToast(t`Could not restore backup`, 'error', getErrorMessage(e));
        } finally {
            resetBackupState();
        }
    };

    const submitBackup = async (file: File) => {
        if (file.name.toLowerCase().endsWith('json')) {
            makeToast(t`legacy backups are not supported!`, 'error');
            return;
        }

        const isValidFilename = file.name.toLowerCase().match(/proto\.gz$|tachibk$/g);
        if (!isValidFilename) {
            makeToast(t`Invalid filetype`, 'error');
            return;
        }

        const isBackupValid = await validateBackup(file);
        if (isBackupValid) {
            await restoreBackup(file);
        }
    };

    useWindowEvent('drop', async (e) => {
        e.preventDefault();
        const files = await fromEvent(e);

        submitBackup(files[0] as File);
    });
    useWindowEvent('dragover', (e) => {
        e.preventDefault();
    });
    const inputEventListenerRef = useEventListener('change', async (event) => {
        const files = await fromEvent(event);
        submitBackup(files[0] as File);
    });
    const mergedInputRef = useMergedRef(inputRef, inputEventListenerRef);

    if (loading) {
        return <LoadingPlaceholder />;
    }

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('Backup::refetch'))}
            />
        );
    }

    const backupSettings = settingsData!.settings as ServerSettings;

    const dirPlaceholder = (folder: string) => (dataDir ? `${dataDir}/${folder}` : t`Default`);

    return (
        <>
            <List sx={{ padding: 0 }}>
                <ListItemButton>
                    <ListItemText primary={t`Storage location`} secondary={dataDir ?? t`Unable to load data`} />
                </ListItemButton>
                <TextSetting
                    settingName={t`Download location`}
                    dialogDescription={t`The path to the directory on the server where downloads should get saved in`}
                    value={backupSettings.downloadsPath}
                    settingDescription={
                        backupSettings.downloadsPath.length ? backupSettings.downloadsPath : dirPlaceholder('downloads')
                    }
                    handleChange={(path) => updateSetting('downloadsPath', path)}
                />
                <TextSetting
                    settingName={t`Local source location`}
                    dialogDescription={t`The path to the directory on the server where local source files are saved in`}
                    value={backupSettings.localSourcePath}
                    settingDescription={
                        backupSettings.localSourcePath.length ? backupSettings.localSourcePath : dirPlaceholder('local')
                    }
                    handleChange={(path) => updateSetting('localSourcePath', path)}
                />
                <TextSetting
                    settingName={t`Backup location`}
                    dialogDescription={t`The path to the directory on the server where automated backups should get saved in`}
                    value={backupSettings.backupPath}
                    settingDescription={
                        backupSettings.backupPath.length ? backupSettings.backupPath : dirPlaceholder('autobackup')
                    }
                    handleChange={(path) => updateSetting('backupPath', path)}
                />
                <List
                    subheader={
                        <ListSubheader component="div" id="backup-settings">
                            {t`Backup & Restore`}
                        </ListSubheader>
                    }
                >
                    <ListItemButton onClick={createBackup}>
                        <ListItemText primary={t`Create backup`} secondary={t`Back up library as a Tachiyomi backup`} />
                    </ListItemButton>
                    <ListItemButton onClick={() => inputRef.current?.click()} disabled={!!backupRestoreId}>
                        <ListItemText
                            primary={t`Restore Backup`}
                            secondary={t`You can also drag and drop the backup file here to restore it`}
                        />
                        {backupRestoreId ? (
                            <ListItemIcon>
                                <CircularProgressWithText progress={restoreProgress} />
                            </ListItemIcon>
                        ) : null}
                    </ListItemButton>
                    <AutoBackupFrequencySetting
                        value={backupSettings.autoBackupFrequency ?? 43200}
                        handleChange={(minutes) => updateSetting('autoBackupFrequency', minutes)}
                    />
                </List>
            </List>
            <input ref={mergedInputRef} type="file" style={{ display: 'none' }} />
        </>
    );
}
