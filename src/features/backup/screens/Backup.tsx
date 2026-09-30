/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
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
import dayjs from 'dayjs';
import { useLingui } from '@lingui/react/macro';
import { plural } from '@lingui/core/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { BackupRestoreState } from '@/lib/graphql/generated/graphql-base.types.ts';
import { CircularProgressWithText } from '@/base/components/feedback/CircularProgressWithText.tsx';
import { PathSetting } from '@/base/components/settings/text/PathSetting.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { epochToDate, getDateString } from '@/base/utils/DateHelper.ts';
import { BackupFlagInclusionDialog } from '@/features/backup/component/BackupFlagInclusionDialog.tsx';
import { BackupValidationDialog } from '@/features/backup/component/BackupValidationDialog.tsx';
import type { BackupFlagInclusionState, BackupSettingsType } from '@/features/backup/Backup.types.ts';
import type { ServerSettings } from '@/features/settings/Settings.types.ts';
import { ImageCache } from '@/lib/service-worker/ImageCache.ts';
import { isAndroidApp, pickDirectory } from '@/lib/platform/AndroidBridge.ts';
import { saveFileAs } from '@/lib/platform/SaveFile.ts';

let backupRestoreId: string | undefined;

/**
 * 清掉 <input type=file> 里选中的文件。不清的话，再选同一个文件浏览器不会派发
 * change，用户会以为「点了没反应」。
 */
const resetBackupState = (input: HTMLInputElement | null) => {
    if (input) {
        // 这里就是要把参数指向的 DOM 节点清空
        // oxlint-disable-next-line no-param-reassign
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
    lastBackupAt: number;
    handleChange: (minutes: number) => void;
}> = ({ value, lastBackupAt, handleChange }) => {
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

    // Dragging must track the pointer immediately and only persist on
    // release: the server value (parent `value`) does not round-trip until
    // the mutation resolves, so a fully controlled slider snaps back to the
    // old position and feels unresponsive. Keep an optimistic local index
    // and resync it whenever the stored server value actually changes.
    const [uiStep, setUiStep] = useState<number | null>(null);
    useEffect(() => {
        setUiStep(null);
    }, [value]);
    const shownStep = uiStep ?? step;

    const display = (idx: number): string => {
        if (idx === 0) {
            return t`Off`;
        }
        if (idx <= 12) {
            // Count-1 (1 hour) uses the plain "Every hour" message: Chinese has
            // no plural "one" form, so an ICU plural would render "每 1 小时"
            // instead of "每小时".
            return idx === 1 ? t`Every hour` : plural(idx, { one: 'Every hour', other: `Every # hours` });
        }
        if (idx <= 18) {
            // Keep the plural argument a plain identifier so Lingui extracts
            // a stable msgid — an inline expression ("idx - 12") would
            // produce a different id and fall back to English.
            const dayCount = idx - 12;
            return idx === 13 ? t`Every day` : plural(dayCount, { one: 'Every day', other: `Every # days` });
        }
        return t`Every week`;
    };

    // 上次自动备份时间：0 表示调度任务还没跑过（或已禁用后从未执行）。
    const lastBackupText = lastBackupAt > 0 ? getDateString(epochToDate(lastBackupAt), true) : t`Never`;

    return (
        <ListItemButton sx={{ display: 'block', alignItems: 'center', overflowX: 'hidden' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{t`Auto backup frequency`}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {display(shownStep)}
                </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
                {t`Last automatic backup: ${lastBackupText}`}
            </Typography>
            <Slider
                value={shownStep}
                min={0}
                max={19}
                step={1}
                valueLabelDisplay="off"
                onChange={(_e, v) => setUiStep(v as number)}
                onChangeCommitted={(_e, v) => handleChange(FREQ_MINUTES[v as number])}
            />
        </ListItemButton>
    );
};

export function Backup() {
    const { t } = useLingui();

    useAppTitle(t`Data & Storage`);

    const { data: settingsData, loading, error, refetch } = requestManager.useGetServerSettings();
    const { data: aboutData } = requestManager.useGetAbout();
    const [mutateSettings] = requestManager.useUpdateServerSettings();
    const [triggerRebuildDownloadIndex, { loading: isRebuildingDownloadIndex }] =
        requestManager.useRebuildDownloadIndex();
    const [triggerClearServerCache, { loading: isClearingServerCache }] = requestManager.useClearServerCache();

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

    // 存储管理 —— 重建下载索引：让服务端重新扫 <存储位置>/downloads 对账数据库
    const rebuildDownloadIndex = async () => {
        try {
            const response = await triggerRebuildDownloadIndex({ variables: { input: {} } });
            const chapters = response.data?.rebuildDownloadIndex.chapters ?? 0;
            const chaptersText = plural(chapters, { one: '# chapter', other: '# chapters' });
            makeToast(t`Download index rebuilt: ${chaptersText}`, 'success');
        } catch (e) {
            makeToast(t`Could not rebuild the download index`, 'error', getErrorMessage(e));
        }
    };

    // 存储管理 —— 清除缓存（原先在「服务端设置」子页）：服务端图片缓存 + 浏览器
    // Service Worker 里的图片缓存，两边都要清，只清一边等于没清
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

    // Android 宿主里路径项不能手填：写盘的是同进程的 Rust server，能写哪个目录由
    // 系统的「所有文件访问」+ SAF 授权决定（见 lib/platform/AndroidBridge.ts）。
    // 桌面端起服务再打开网页时没有这个桥，照旧用文本对话框。
    const isAndroid = isAndroidApp();

    const chooseDirectory = async (current: string) => {
        const picked = await pickDirectory(current);
        if (picked.error) {
            makeToast(t`Could not choose the directory`, 'error', picked.error);
            return;
        }
        if (!picked.path) {
            return; // 用户取消
        }

        updateSetting('dataDir', picked.path);
        makeToast(t`Storage location updated. It takes effect after a restart.`, 'success');
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
        let flags: BackupFlagInclusionState;
        try {
            flags = await AwaitableComponent.show(BackupFlagInclusionDialog, {
                title: t`Create backup`,
            });
        } catch (_) {
            return; // 用户关掉了对话框
        }

        // 与 `/api/v1/backup/export/file` 的 Content-Disposition 同名，用户另存到
        // data/autobackup 时能和自动备份排在一起。
        const fileName = `org.suwayomi.next_${dayjs().format('YYYY-MM-DD_HH-mm')}.tachibk`;

        const loadBackup = async () => {
            makeToast(t`Creating backup…`, 'info');

            const backupFileResponse = await requestManager.createBackupFile({ flags }).response;
            const backupFileUrl = backupFileResponse.data?.createBackup.url;
            if (!backupFileUrl) {
                throw new Error(getErrorMessage(backupFileResponse.error));
            }

            return requestManager.getBackupFile(requestManager.getValidUrlFor(backupFileUrl, ''));
        };

        try {
            const result = await saveFileAs(fileName, loadBackup);

            if (result === 'unsupported') {
                // 没有另存为对话框（非安全上下文、Firefox/Safari、Android WebView）
                // 就退回静默下载。
                const url = URL.createObjectURL(await loadBackup());
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                link.remove();
                // 立即 revoke 会把还没起步的下载打断
                window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
                return;
            }

            if (result === 'saved') {
                makeToast(t`Backup created`, 'success');
            }
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
            resetBackupState(inputRef.current);
        }

        return false;
    };

    const restoreBackup = async (backup: File) => {
        let flags: BackupFlagInclusionState;
        try {
            flags = await AwaitableComponent.show(BackupFlagInclusionDialog, {
                title: t`Restore Backup`,
            });
        } catch (_) {
            // 用户关掉对话框。这里必须接住：`submitBackup` 是被事件监听器直接调用的，
            // 没人 catch，漏出去就是一条 unhandled rejection。同时要把 input 的值清掉，
            // 否则再选同一个文件不会触发 change。
            resetBackupState(inputRef.current);
            return;
        }

        try {
            makeToast(t`Restoring backup…`, 'info');

            const response = await requestManager.restoreBackupFile({ backup, flags }).response;
            backupRestoreId = response.data?.restoreBackup.id;
            setTriggerReRender(Date.now());
        } catch (e) {
            makeToast(t`Could not restore backup`, 'error', getErrorMessage(e));
        } finally {
            resetBackupState(inputRef.current);
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

    // 存储位置：设置里显式填了就用它，否则用服务端解析出来的默认目录
    const storageLocation = backupSettings.dataDir?.length
        ? backupSettings.dataDir
        : (aboutData?.aboutServer.dataDir ?? '');

    // 应用数据位置：服务端启动时解析出来的可写根（缓存 / 库 / 设置 / 扩展都在它
    // 下面）。它决定数据库放在哪，改不了也存不进库里，所以界面上只展示与复制。
    const appdataDir = aboutData?.aboutServer.appdataDir ?? '';

    // 分隔符跟**服务端**走（从实际目录就能看出来），不要猜客户端系统：WebUI 可能
    // 开在手机上而服务端在 Windows 上。原来这里写死 `/`，windows 上就成了
    // `...\data/downloads` 这种正反斜杠混用。
    //
    // 判据用服务端**解析后**的数据目录，不用 storageLocation：后者在设置里存着占位符
    // 时是那串占位符本身，看不出服务端是哪个平台。
    const resolvedDataDir = aboutData?.aboutServer.dataDir ?? '';
    const storageSeparator = resolvedDataDir.includes('\\') && !resolvedDataDir.includes('/') ? '\\' : '/';

    // 行上单击复制的是**能直接用的绝对路径**：设置里存的是占位符时按服务端的规则展开
    // （%APPDIR% = 发布根、%DATADIR% = 数据目录），分隔符统一成服务端那套。
    // 拿不到基准目录（老服务端没有 appDir 字段）时原样返回。
    const resolveAbsolutePath = (path: string) => {
        const match = /^%(APPDIR|DATADIR)%/i.exec(path);
        if (!match) {
            return path;
        }
        const base =
            match[1].toUpperCase() === 'APPDIR'
                ? (aboutData?.aboutServer.appDir ?? '')
                : (aboutData?.aboutServer.dataDir ?? '');
        if (!base) {
            return path;
        }
        const rest = path.slice(match[0].length).replace(/^[\\/]+/, '');
        if (!rest) {
            return base;
        }
        return `${base.replace(/[\\/]+$/, '')}${storageSeparator}${rest.replaceAll(/[\\/]+/g, storageSeparator)}`;
    };

    // 行上展示的是「这个目录是从哪来的」：占位符（服务端认的 %APPDIR% / %DATADIR%）
    // 在界面上要本地化成 <程序目录> / <存储位置>；真实的完整路径留给整行单击复制
    // （见 PathSetting 的 copyValue）。
    const appDirLabel = `<${t`App directory`}>`;
    const storageDirLabel = `<${t`Storage location`}>`;
    const localizePathSource = (path: string) =>
        path.replace(/^%(APPDIR|DATADIR)%/i, (_match, token: string) =>
            token.toUpperCase() === 'APPDIR' ? appDirLabel : storageDirLabel,
        );

    // 编辑对话框里的背景占位反过来：那里正是要写值的地方，给服务端认的占位符写法
    // （%APPDIR% = 程序目录，%DATADIR% = 存储位置），分隔符跟服务端风格走。
    const tokenPlaceholder = (token: string, folder: string) => `${token}${storageSeparator}${folder}`;

    return (
        <>
            <List sx={{ padding: 0 }}>
                <PathSetting
                    settingName={t`Storage location`}
                    dialogDescription={t`Directory the server keeps its data in (downloads, local sources, automated backups). The database file is kept separately, so changing this will not lose any settings. Takes effect after a restart.`}
                    value={backupSettings.dataDir ?? ''}
                    displayedPath={localizePathSource(storageLocation)}
                    copyValue={resolveAbsolutePath(storageLocation)}
                    placeholder={tokenPlaceholder('%APPDIR%', 'data')}
                    onEdit={isAndroid ? () => void chooseDirectory(backupSettings.dataDir ?? '') : undefined}
                    handleChange={(path) => updateSetting('dataDir', path)}
                />
                <PathSetting
                    settingName={t`App data location`}
                    value={appdataDir}
                    displayedPath={appdataDir}
                    readOnly
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
                        lastBackupAt={Number(aboutData?.aboutServer.lastAutoBackupAt ?? 0)}
                        handleChange={(minutes) => updateSetting('autoBackupFrequency', minutes)}
                    />
                </List>
                <List
                    subheader={
                        <ListSubheader component="div" id="storage-management">
                            {t`Storage management`}
                        </ListSubheader>
                    }
                >
                    <ListItemButton disabled={isRebuildingDownloadIndex} onClick={() => void rebuildDownloadIndex()}>
                        <ListItemText
                            primary={t`Rebuild download index`}
                            secondary={t`Force a rescan of already downloaded chapters`}
                        />
                        {isRebuildingDownloadIndex ? (
                            <ListItemIcon>
                                <CircularProgress size={24} />
                            </ListItemIcon>
                        ) : null}
                    </ListItemButton>
                    <ListItemButton disabled={isClearingServerCache} onClick={() => void clearCache()}>
                        <ListItemText primary={t`Clear cache`} />
                    </ListItemButton>
                </List>
            </List>
            <input ref={mergedInputRef} type="file" style={{ display: 'none' }} />
        </>
    );
}
