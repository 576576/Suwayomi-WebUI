/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Switch from '@mui/material/Switch';
import { d } from 'koration';
import { useLingui } from '@lingui/react/macro';
import { AwaitableComponent } from 'awaitable-component';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { TextSetting } from '@/base/components/settings/text/TextSetting.tsx';
import { NumberSetting } from '@/base/components/settings/NumberSetting.tsx';
import { SelectSetting } from '@/base/components/settings/SelectSetting.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { makeToast } from '@/base/utils/Toast.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import type { PartialSettingsTypeInput } from '@/lib/graphql/generated/graphql-base.types.ts';
import {
    AuthMode,
    CbzMediaType,
    SortOrder,
    StartSyncResult,
    SyncState,
} from '@/lib/graphql/generated/graphql-base.types.ts';
import {
    AUTH_MODES_SELECT_VALUES,
    SYNC_INTERVAL_CUSTOM_VALUE,
    SYNC_INTERVAL_SELECT_VALUES,
    SYNC_INTERVAL_SELECT_VALUES_WITH_CUSTOM,
    SYNC_INTERVAL_VALUES,
    SYNC_SETTINGS_HIDDEN_BACKUP_FLAGS,
    SYNC_START_RESULT_TRANSLATION,
    SYNC_STATE_TRANSLATION,
} from '@/features/settings/Settings.constants.ts';
import { AuthManager } from '@/features/authentication/AuthManager.ts';
import type { ServerSettings as ServerSettingsType } from '@/features/settings/Settings.types.ts';
import { KoreaderSyncSettings } from '@/features/settings/components/koreaderSync/KoreaderSyncSettings.tsx';
import { BackupFlagInclusionDialog } from '@/features/backup/component/BackupFlagInclusionDialog.tsx';
import { convertToAutoBackupFlags, getAutoBackupFlagsInfo } from '@/features/backup/Backup.utils.ts';
import type { BackupFlagInclusionState } from '@/features/backup/Backup.types.ts';
import { getDateString } from '@/base/utils/DateHelper.ts';
import { ImageCache } from '@/lib/service-worker/ImageCache.ts';

const convertSyncDataToBackupFlags = (settings: ServerSettingsType): BackupFlagInclusionState => ({
    includeManga: settings.syncDataManga,
    includeChapters: settings.syncDataChapters,
    includeCategories: settings.syncDataCategories,
    includeHistory: settings.syncDataHistory,
    includeTracking: settings.syncDataTracking,
    includeClientData: false,
    includeServerSettings: false,
});

const convertBackupFlagsToSyncData = (flags: BackupFlagInclusionState): PartialSettingsTypeInput => ({
    syncDataManga: flags.includeManga,
    syncDataChapters: flags.includeChapters,
    syncDataCategories: flags.includeCategories,
    syncDataHistory: flags.includeHistory,
    syncDataTracking: flags.includeTracking,
});

/**
 * `/settings/advanced/server` —— 服务端设置。
 *
 * 从 09-01 被删的 ServerSettings 页里只恢复**服务器侧**的分区（客户端那部分另有归属：
 * 服务器地址在登录/闪屏页、两个版本更新提示在 About）。其中又只保留后端有对应实现的：
 * 服务器绑定 / 认证 / OPDS / KOReader 同步 / 同步。没恢复的几类及原因：
 * `SOCKS 代理`、`绕过 Cloudflare`、`杂项`（调试日志、托盘图标、日志轮转）在 Rust 侧
 * 没有任何实现；`数据库` 在本项目由 `SUWAYOMI_DB_BACKEND` / `SUWAYOMI_DATABASE_URL`
 * 决定，H2 与 Hikari 无对应实现；`WebView` 分区更是已移除（CEF 换成独立托盘程序）。
 */
export const ServerSettings = () => {
    const { t } = useLingui();

    useAppTitle(t`Server settings`);

    const syncStatusRequest = requestManager.useGetSyncStatus();

    const {
        data,
        loading: areServerSettingsLoading,
        error: serverSettingsError,
        refetch: refetchServerSettings,
    } = requestManager.useGetServerSettings();
    const [mutateSettings] = requestManager.useUpdateServerSettings();

    const koSyncStatus = requestManager.useKoSyncStatus();

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

    const updateSetting = async <Setting extends keyof ServerSettingsType>(
        setting: Setting,
        value: ServerSettingsType[Setting],
        onCompletion?: (success: boolean) => void,
    ) => {
        try {
            await mutateSettings({ variables: { input: { settings: { [setting]: value } } } });
            onCompletion?.(true);
        } catch (e) {
            makeToast(t`Failed to save changes`, 'error', getErrorMessage(e));
            onCompletion?.(false);
        }
    };
    const updateSettings = async (settings: PartialSettingsTypeInput, onCompletion?: (success: boolean) => void) => {
        try {
            await mutateSettings({ variables: { input: { settings } } });
            onCompletion?.(true);
        } catch (e) {
            makeToast(t`Failed to save changes`, 'error', getErrorMessage(e));
            onCompletion?.(false);
        }
    };

    const loading = areServerSettingsLoading || koSyncStatus.loading;
    if (loading) {
        return <LoadingPlaceholder />;
    }

    const error = serverSettingsError ?? koSyncStatus.error;
    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => {
                    if (serverSettingsError) {
                        refetchServerSettings().catch(
                            defaultPromiseErrorHandler('ServerSettings::refetchServerSettings'),
                        );
                    }

                    if (koSyncStatus.error) {
                        koSyncStatus
                            .refetch()
                            .catch(defaultPromiseErrorHandler('ServerSettings::koSyncStatus.refetch'));
                    }
                }}
            />
        );
    }

    const serverSettings = data!.settings;
    const koreaderSyncStatus = koSyncStatus.data!.koSyncStatus;
    const authModeDisabled = !serverSettings.authUsername?.trim() || !serverSettings.authPassword?.trim();

    const isCustomSyncInterval = !SYNC_INTERVAL_VALUES.includes(
        d(serverSettings.syncInterval).minutes.asWholeMinutes.toISOString(),
    );
    const syncDataFlagsInfo = getAutoBackupFlagsInfo(
        convertToAutoBackupFlags(convertSyncDataToBackupFlags(serverSettings)),
        SYNC_SETTINGS_HIDDEN_BACKUP_FLAGS,
    );
    const includedSyncDataText = syncDataFlagsInfo.true;
    const excludedSyncDataText = syncDataFlagsInfo.false;

    const syncStatus = syncStatusRequest.data?.lastSyncStatus;
    const tmpSyncDate = syncStatus?.endDate ?? syncStatus?.startDate;
    const syncDate = tmpSyncDate ? getDateString(Number(tmpSyncDate), true, true) : undefined;
    const syncState = syncStatus?.state;
    const isSyncing = !!syncState && ![SyncState.Success, SyncState.Error].includes(syncState);

    return (
        <List sx={{ pt: 0 }}>
            {/* 原先在「高级」页最顶上，改为一并放进服务端设置（不再带副标题）。 */}
            <ListItemButton disabled={isClearingServerCache} onClick={clearCache}>
                <ListItemText primary={t`Clear cache`} />
            </ListItemButton>
            <List
                subheader={
                    <ListSubheader component="div" id="server-settings-server-address">
                        {t`Server bindings`}
                    </ListSubheader>
                }
            >
                <TextSetting
                    settingName={t`IP`}
                    handleChange={(ip) => updateSetting('ip', ip)}
                    value={serverSettings.ip}
                    placeholder="0.0.0.0"
                />
                <NumberSetting
                    settingTitle={t`Port`}
                    settingValue={serverSettings.port.toString()}
                    handleUpdate={(port) => updateSetting('port', port)}
                    value={serverSettings.port}
                    defaultValue={4567}
                    valueUnit={t`Port`}
                />
            </List>
            <List
                subheader={
                    <ListSubheader component="div" id="server-settings-auth">
                        {t`Authentication`}
                    </ListSubheader>
                }
            >
                <SelectSetting<AuthMode>
                    settingName={t`Authentication Mode`}
                    value={serverSettings.authMode}
                    values={AUTH_MODES_SELECT_VALUES}
                    handleChange={(mode) => {
                        updateSetting('authMode', mode, (success) => {
                            if (!success) {
                                return;
                            }

                            if (mode !== AuthMode.UiLogin) {
                                AuthManager.removeTokens();
                            }

                            AuthManager.setAuthRequired(mode === AuthMode.UiLogin);
                        });
                    }}
                    disabled={authModeDisabled}
                />
                <TextSetting
                    settingName={t`Username`}
                    value={serverSettings.authUsername}
                    validate={(value) => serverSettings.authMode === AuthMode.None || !!value.trim()}
                    handleChange={(authUsername) => updateSetting('authUsername', authUsername)}
                />
                <TextSetting
                    settingName={t`Password`}
                    value={serverSettings.authPassword}
                    isPassword
                    validate={(value) => serverSettings.authMode === AuthMode.None || !!value.trim()}
                    handleChange={(authPassword) => updateSetting('authPassword', authPassword)}
                />
            </List>
            <List
                subheader={
                    <ListSubheader component="div" id="server-settings-opds">
                        {t`OPDS`}
                    </ListSubheader>
                }
            >
                <ListItem>
                    <ListItemText
                        primary={t`Binary file size`}
                        secondary={t`Display file sizes in binary (KiB, MiB, GiB) instead of decimal (KB, MB, GB)`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsUseBinaryFileSizes}
                        onChange={(e) => updateSetting('opdsUseBinaryFileSizes', e.target.checked)}
                    />
                </ListItem>
                <NumberSetting
                    settingTitle={t`Items per page`}
                    settingValue={serverSettings.opdsItemsPerPage.toString()}
                    dialogDescription={t`Number of items per page in OPDS feeds (e.g., Library History, Manga Chapters).\nHigher values may affect client performance.`}
                    value={serverSettings.opdsItemsPerPage}
                    defaultValue={50}
                    minValue={10}
                    maxValue={5000}
                    stepSize={10}
                    showSlider
                    valueUnit={t`item`}
                    handleUpdate={(value) => updateSetting('opdsItemsPerPage', value)}
                />
                <ListItem>
                    <ListItemText
                        primary={t`Enable page read progress`}
                        secondary={t`Track and update your reading progress by page for each chapter during page streaming`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsEnablePageReadProgress}
                        onChange={(e) => updateSetting('opdsEnablePageReadProgress', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Mark chapters as read on download`}
                        secondary={t`Automatically mark chapters as read when you download them.`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsMarkAsReadOnDownload}
                        onChange={(e) => updateSetting('opdsMarkAsReadOnDownload', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Show only unread chapters`}
                        secondary={t`Filter manga feed to display only chapters you haven’t read yet.`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsShowOnlyUnreadChapters}
                        onChange={(e) => updateSetting('opdsShowOnlyUnreadChapters', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Show only downloaded chapters`}
                        secondary={t`Filter manga feed to display only chapters you have downloaded.`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsShowOnlyDownloadedChapters}
                        onChange={(e) => updateSetting('opdsShowOnlyDownloadedChapters', e.target.checked)}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t`Skip chapter metadata feed`}
                        secondary={t`When enabled, download and streaming links are provided directly in the chapter list. KoSync strategies are applied, but PROMPT conflicts are ignored (treating local progress as priority)`}
                    />
                    <Switch
                        edge="end"
                        checked={serverSettings.opdsSkipChapterMetadataFeed}
                        onChange={(e) => updateSetting('opdsSkipChapterMetadataFeed', e.target.checked)}
                    />
                </ListItem>
                <SelectSetting<SortOrder>
                    settingName={t`Chapter sort order`}
                    dialogDescription={t`Choose the order in which chapters are displayed.`}
                    value={serverSettings.opdsChapterSortOrder}
                    values={[
                        [
                            SortOrder.Asc,
                            {
                                text: t`Ascending`,
                            },
                        ],
                        [
                            SortOrder.Desc,
                            {
                                text: t`Descending`,
                            },
                        ],
                    ]}
                    handleChange={(value) => updateSetting('opdsChapterSortOrder', value)}
                />
                <SelectSetting<CbzMediaType>
                    settingName={t`CBZ MIME-Type`}
                    dialogDescription={t`Controls the MimeType that Suwayomi sends in OPDS entries for CBZ archives. Also affects global CBZ download.\nModern follows recent IANA standard (2017), while LEGACY (deprecated mimetype for .cbz) and COMPATIBLE (deprecated mimetype for all comic archives) might be more compatible with older clients.`}
                    value={serverSettings.opdsCbzMimetype}
                    values={[
                        [
                            CbzMediaType.Legacy,
                            {
                                text: t`Legacy`,
                            },
                        ],
                        [
                            CbzMediaType.Modern,
                            {
                                text: t`Modern`,
                            },
                        ],
                        [
                            CbzMediaType.Compatible,
                            {
                                text: t`Compatible`,
                            },
                        ],
                    ]}
                    handleChange={(value) => updateSetting('opdsCbzMimetype', value)}
                />
            </List>
            <KoreaderSyncSettings
                settings={serverSettings}
                serverAddress={koreaderSyncStatus.serverAddress}
                username={koreaderSyncStatus.username}
                isLoggedIn={koreaderSyncStatus.isLoggedIn}
                updateSetting={updateSetting}
            />
            <List
                subheader={
                    <ListSubheader component="div" id="server-settings-sync">
                        {t`Sync`}
                    </ListSubheader>
                }
            >
                <ListItemButton
                    disabled={isSyncing}
                    onClick={() =>
                        requestManager
                            .startSync()
                            .response.then((response) => {
                                const startResult = response.data?.startSync.result;

                                makeToast(
                                    t(SYNC_START_RESULT_TRANSLATION[startResult!]),
                                    startResult === StartSyncResult.Success ? 'success' : 'error',
                                );
                            })
                            .catch((e) => makeToast(t`Could not start sync`, 'error', getErrorMessage(e)))
                    }
                >
                    <ListItemText
                        primary={isSyncing ? t`Sync status` : t`Start sync`}
                        secondary={
                            <>
                                {syncDate && t`Last sync: ${syncDate}`}{' '}
                                {syncState && t`— State: ${t(SYNC_STATE_TRANSLATION[syncState])}`}
                                {!!syncStatus?.errorMessage && `\nError: ${syncStatus.errorMessage}`}
                            </>
                        }
                    />
                </ListItemButton>
                <ListItemButton
                    onClick={async () => {
                        try {
                            const flags = await AwaitableComponent.show(BackupFlagInclusionDialog, {
                                title: t`Sync data`,
                                flags: convertSyncDataToBackupFlags(serverSettings),
                                hiddenFlags: SYNC_SETTINGS_HIDDEN_BACKUP_FLAGS,
                            });

                            await updateSettings(convertBackupFlagsToSyncData(flags));
                        } catch (e) {
                            // Ignore
                        }
                    }}
                >
                    <ListItemText
                        primary={t`Sync data`}
                        secondary={
                            <>
                                <span>{t`Include: ${includedSyncDataText}`}</span>
                                <span>{t`Exclude: ${excludedSyncDataText}`}</span>
                            </>
                        }
                        slotProps={{
                            secondary: { sx: { display: 'flex', flexDirection: 'column' } },
                        }}
                    />
                </ListItemButton>
                <SelectSetting
                    settingName={t`Sync interval`}
                    value={
                        isCustomSyncInterval
                            ? SYNC_INTERVAL_CUSTOM_VALUE
                            : d(serverSettings.syncInterval).minutes.asWholeMinutes.toISOString()
                    }
                    values={
                        isCustomSyncInterval ? SYNC_INTERVAL_SELECT_VALUES_WITH_CUSTOM : SYNC_INTERVAL_SELECT_VALUES
                    }
                    handleChange={(syncInterval) => updateSetting('syncInterval', syncInterval)}
                />
                <List
                    subheader={
                        <ListSubheader component="div" id="server-settings-sync-syncyomi">
                            {t`SyncYomi`}
                        </ListSubheader>
                    }
                >
                    <ListItem>
                        <ListItemText primary={t`SyncYomi enabled`} />
                        <Switch
                            edge="end"
                            checked={serverSettings.syncYomiEnabled}
                            onChange={(e) => updateSetting('syncYomiEnabled', e.target.checked)}
                        />
                    </ListItem>
                    <TextSetting
                        settingName={t`SyncYomi host`}
                        value={serverSettings.syncYomiHost}
                        handleChange={(host) => updateSetting('syncYomiHost', host)}
                    />
                    <TextSetting
                        settingName={t`SyncYomi API key`}
                        value={serverSettings.syncYomiApiKey}
                        handleChange={(apiKey) => updateSetting('syncYomiApiKey', apiKey)}
                        isPassword
                    />
                </List>
            </List>
        </List>
    );
};
