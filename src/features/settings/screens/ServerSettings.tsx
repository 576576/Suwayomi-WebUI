/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import type { GetKoSyncStatusQuery, GetSyncStatusQuery } from '@/lib/graphql/generated/graphql.ts';
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

type SyncStatus = GetSyncStatusQuery['lastSyncStatus'];
type KoSyncStatus = GetKoSyncStatusQuery['koSyncStatus'];

const convertSyncDataToBackupFlags = (settings: ServerSettingsType): BackupFlagInclusionState => ({
    includeManga: settings.syncDataManga,
    includeChapters: settings.syncDataChapters,
    includeCategories: settings.syncDataCategories,
    includeHistory: settings.syncDataHistory,
    includeTracking: settings.syncDataTracking,
    includeClientData: false,
    includeServerSettings: false,
});

const convertBackupFlagsToSyncData = (flags: BackupFlagInclusionState): Partial<ServerSettingsType> => ({
    syncDataManga: flags.includeManga,
    syncDataChapters: flags.includeChapters,
    syncDataCategories: flags.includeCategories,
    syncDataHistory: flags.includeHistory,
    syncDataTracking: flags.includeTracking,
});

/**
 * 认证相关设置只有重启才生效（见 `ServerSettingsEditor` 里的说明）。改动这些键时
 * 保存提示要额外说一句，否则用户会以为立刻生效了。
 */
const RESTART_ONLY_SETTINGS: (keyof ServerSettingsType)[] = [
    'authMode',
    'authUsername',
    'authPassword',
    'jwtAudience',
    'jwtTokenExpiry',
    'jwtRefreshExpiry',
];

/**
 * 退出登录：清掉服务端的会话 cookie，再丢掉浏览器里的令牌。
 *
 * cookie 是 `HttpOnly` 的，脚本删不掉，只能让服务端把 `Max-Age=0` 写回来；随后
 * `requestManager.reset()` 把认证探测重置回"未知"，重探时的 401 会把用户送回登录页。
 */
const logOut = async () => {
    await fetch(`${requestManager.getBaseUrl()}/logout`, { credentials: 'include' }).catch(() => undefined);
    requestManager.reset();
};

/**
 * `/settings/advanced/server` —— 服务端设置。
 *
 * 从 09-01 被删的 ServerSettings 页里只恢复**服务器侧**的分区（客户端那部分另有归属：
 * 服务器地址在登录/闪屏页、两个版本更新提示在 About）。其中又只保留后端有对应实现的：
 * 服务器绑定 / 认证 / OPDS / KOReader 同步 / 同步。没恢复的几类及原因：
 * `SOCKS 代理`、`绕过 Cloudflare`、`杂项`（调试日志、托盘图标、日志轮转）在 Rust 侧
 * 没有任何实现；`数据库` 在本项目由 `SUWAYOMI_DB_BACKEND` / `SUWAYOMI_DATABASE_URL`
 * 决定，H2 与 Hikari 无对应实现；`WebView` 分区更是已移除（CEF 换成独立托盘程序）。
 *
 * 这一层只负责取数与加载/错误态；表单本身在 `ServerSettingsEditor` 里，因为草稿状态
 * 必须等到数据就绪之后才能初始化（早期 return 之前不能挂 hook）。
 */
export function ServerSettings() {
    const { t } = useLingui();

    useAppTitle(t`Server settings`);

    const syncStatusRequest = requestManager.useGetSyncStatus();

    const {
        data,
        loading: areServerSettingsLoading,
        error: serverSettingsError,
        refetch: refetchServerSettings,
    } = requestManager.useGetServerSettings();

    const koSyncStatus = requestManager.useKoSyncStatus();

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

    return (
        <ServerSettingsEditor
            savedSettings={data!.settings}
            koreaderSyncStatus={koSyncStatus.data!.koSyncStatus}
            syncStatus={syncStatusRequest.data?.lastSyncStatus}
        />
    );
}

/**
 * 服务端设置表单：改动先落在草稿里，`Save` 才提交，`Discard` 丢弃草稿回到最后一次
 * 从服务端读到的值。
 *
 * 这里的项（端口、绑定 IP、认证开关）写下去就没有反悔的余地——改错了只能去改环境变量
 * 或直接编辑数据库，所以不能逐项即时保存。
 */
function ServerSettingsEditor({
    savedSettings,
    koreaderSyncStatus,
    syncStatus,
}: {
    savedSettings: ServerSettingsType;
    koreaderSyncStatus: KoSyncStatus;
    syncStatus: SyncStatus | undefined;
}) {
    const { t } = useLingui();

    const [mutateSettings] = requestManager.useUpdateServerSettings();
    const { accessToken, refreshToken } = AuthManager.useSession();

    // 用 JSON 当比较基准：设置是纯数据对象，逐键比较反而不如整体序列化直白，
    // 也需要它来判断"有没有改过"（字段有 90 多个）。
    const savedSettingsJson = useMemo(() => JSON.stringify(savedSettings), [savedSettings]);
    const [draft, setDraft] = useState<ServerSettingsType>(savedSettings);

    useEffect(() => {
        // 服务端值变了（保存后回读、别的客户端改了同一份设置）→ 草稿回到已保存状态。
        setDraft(JSON.parse(savedSettingsJson) as ServerSettingsType);
    }, [savedSettingsJson]);

    /** 只提交真正变了的键，避免把没碰过的设置（尤其是密码）再写一遍。 */
    const changes = useMemo(() => {
        const saved = JSON.parse(savedSettingsJson) as Record<string, unknown>;
        const changed: Record<string, unknown> = {};

        Object.entries(draft as Record<string, unknown>).forEach(([key, value]) => {
            // `__typename` 是 Apollo 塞进缓存里的，不是设置项
            if (key.startsWith('__') || !(key in saved)) {
                return;
            }

            if (JSON.stringify(value) !== JSON.stringify(saved[key])) {
                changed[key] = value;
            }
        });

        return changed as PartialSettingsTypeInput;
    }, [draft, savedSettingsJson]);

    const changedKeys = Object.keys(changes);
    const isDirty = changedKeys.length > 0;
    const requiresRestart = changedKeys.some((key) => RESTART_ONLY_SETTINGS.includes(key as keyof ServerSettingsType));

    const [isSaving, setIsSaving] = useState(false);

    const updateSetting = async <Setting extends keyof ServerSettingsType>(
        setting: Setting,
        value: ServerSettingsType[Setting],
        onCompletion?: (success: boolean) => void,
    ) => {
        setDraft((current) => ({ ...current, [setting]: value }));
        onCompletion?.(true);
    };

    const updateSettings = async (settings: Partial<ServerSettingsType>, onCompletion?: (success: boolean) => void) => {
        setDraft((current) => ({ ...current, ...settings }));
        onCompletion?.(true);
    };

    const save = async () => {
        if (!isDirty || isSaving) {
            return;
        }

        setIsSaving(true);

        try {
            await mutateSettings({ variables: { input: { settings: changes } } });
            makeToast(
                requiresRestart ? t`Saved. Restart the server to apply the authentication changes.` : t`Changes saved`,
                'success',
            );
        } catch (e) {
            makeToast(t`Failed to save changes`, 'error', getErrorMessage(e));
        } finally {
            setIsSaving(false);
        }
    };

    const settings = draft;

    const canLogOut = !!accessToken || !!refreshToken;

    // 服务端启动时（`auth_setup::resolve`）非 DISABLED 模式要求用户名与密码都非空，
    // 否则直接拒绝启动。判据只能是**保存后**的组合：`模式为无 + 凭据为空`是合法的
    // （也正是清掉旧凭据的唯一途径），把"字段为空"本身当错会让人再也清不掉凭据。
    const credentialsMissing =
        draft.authMode !== AuthMode.None && (!draft.authUsername.trim() || !draft.authPassword.trim());

    const isCustomSyncInterval = !SYNC_INTERVAL_VALUES.includes(
        d(settings.syncInterval).minutes.asWholeMinutes.toISOString(),
    );
    const syncDataFlagsInfo = getAutoBackupFlagsInfo(
        convertToAutoBackupFlags(convertSyncDataToBackupFlags(settings)),
        SYNC_SETTINGS_HIDDEN_BACKUP_FLAGS,
    );
    const includedSyncDataText = syncDataFlagsInfo.true;
    const excludedSyncDataText = syncDataFlagsInfo.false;

    const tmpSyncDate = syncStatus?.endDate ?? syncStatus?.startDate;
    const syncDate = tmpSyncDate ? getDateString(Number(tmpSyncDate), true, true) : undefined;
    const syncState = syncStatus?.state;
    const isSyncing = !!syncState && ![SyncState.Success, SyncState.Error].includes(syncState);

    return (
        <Box sx={{ pb: 1 }}>
            <List sx={{ pt: 0 }}>
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
                        value={settings.ip}
                        placeholder="0.0.0.0"
                    />
                    <NumberSetting
                        settingTitle={t`Port`}
                        settingValue={settings.port.toString()}
                        handleUpdate={(port) => updateSetting('port', port)}
                        value={settings.port}
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
                        value={settings.authMode}
                        values={AUTH_MODES_SELECT_VALUES}
                        handleChange={(mode) => updateSetting('authMode', mode)}
                    />
                    <TextSetting
                        settingName={t`Username`}
                        value={settings.authUsername}
                        validate={(value) => settings.authMode === AuthMode.None || !!value.trim()}
                        handleChange={(authUsername) => updateSetting('authUsername', authUsername)}
                    />
                    <TextSetting
                        settingName={t`Password`}
                        value={settings.authPassword}
                        isPassword
                        validate={(value) => settings.authMode === AuthMode.None || !!value.trim()}
                        handleChange={(authPassword) => updateSetting('authPassword', authPassword)}
                    />
                    <ListItem>
                        <ListItemText
                            primary={t`Applied on restart`}
                            secondary={t`Authentication is read when the server starts. Environment variables (SUWAYOMI_AUTH_*) take precedence over the values saved here.`}
                        />
                    </ListItem>
                    {credentialsMissing && (
                        <ListItem>
                            <ListItemText
                                primary={t`Username and password are required`}
                                secondary={t`Any mode other than disabled needs both, otherwise the server refuses to start.`}
                            />
                        </ListItem>
                    )}
                    {canLogOut && (
                        <ListItemButton
                            onClick={() => {
                                logOut().catch(defaultPromiseErrorHandler('ServerSettings::logOut'));
                            }}
                        >
                            <ListItemText
                                primary={t`Log out`}
                                secondary={t`Forget the tokens stored in this browser and end the session`}
                            />
                        </ListItemButton>
                    )}
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
                            checked={settings.opdsUseBinaryFileSizes}
                            onChange={(e) => updateSetting('opdsUseBinaryFileSizes', e.target.checked)}
                        />
                    </ListItem>
                    <NumberSetting
                        settingTitle={t`Items per page`}
                        settingValue={settings.opdsItemsPerPage.toString()}
                        dialogDescription={t`Number of items per page in OPDS feeds (e.g., Library History, Manga Chapters).\nHigher values may affect client performance.`}
                        value={settings.opdsItemsPerPage}
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
                            checked={settings.opdsEnablePageReadProgress}
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
                            checked={settings.opdsMarkAsReadOnDownload}
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
                            checked={settings.opdsShowOnlyUnreadChapters}
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
                            checked={settings.opdsShowOnlyDownloadedChapters}
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
                            checked={settings.opdsSkipChapterMetadataFeed}
                            onChange={(e) => updateSetting('opdsSkipChapterMetadataFeed', e.target.checked)}
                        />
                    </ListItem>
                    <SelectSetting<SortOrder>
                        settingName={t`Chapter sort order`}
                        dialogDescription={t`Choose the order in which chapters are displayed.`}
                        value={settings.opdsChapterSortOrder}
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
                        value={settings.opdsCbzMimetype}
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
                    settings={settings}
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
                                    flags: convertSyncDataToBackupFlags(settings),
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
                                : d(settings.syncInterval).minutes.asWholeMinutes.toISOString()
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
                                checked={settings.syncYomiEnabled}
                                onChange={(e) => updateSetting('syncYomiEnabled', e.target.checked)}
                            />
                        </ListItem>
                        <TextSetting
                            settingName={t`SyncYomi host`}
                            value={settings.syncYomiHost}
                            handleChange={(host) => updateSetting('syncYomiHost', host)}
                        />
                        <TextSetting
                            settingName={t`SyncYomi API key`}
                            value={settings.syncYomiApiKey}
                            handleChange={(apiKey) => updateSetting('syncYomiApiKey', apiKey)}
                            isPassword
                        />
                    </List>
                </List>
            </List>
            <Box
                sx={{
                    position: 'sticky',
                    bottom: 0,
                    zIndex: (theme) => theme.zIndex.appBar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 1,
                    px: 2,
                    py: 1,
                    // 贴住设置页自己的滚动容器底边（见 Settings.tsx），并在移动端让开
                    // home indicator。
                    pb: 'calc(env(safe-area-inset-bottom) + 8px)',
                    backgroundColor: 'background.paper',
                    borderTop: 1,
                    borderColor: 'divider',
                }}
            >
                <Button variant="text" disabled={!isDirty || isSaving} onClick={() => setDraft(savedSettings)}>
                    {t`Discard`}
                </Button>
                <Button
                    variant="contained"
                    disabled={!isDirty || isSaving || credentialsMissing}
                    onClick={() => save()}
                >
                    {t`Save`}
                </Button>
            </Box>
        </Box>
    );
}
