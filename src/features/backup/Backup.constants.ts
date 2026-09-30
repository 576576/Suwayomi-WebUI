/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import type { BackupFlag, BackupFlagInclusionState } from '@/features/backup/Backup.types.ts';
import { BackupFlagGroup } from '@/features/backup/Backup.types.ts';

export const BACKUP_FLAGS_TO_TRANSLATION: Record<BackupFlag, MessageDescriptor> = {
    includeManga: msg`Library entries`,
    includeChapters: msg`Chapters`,
    includeTracking: msg`Tracking`,
    includeHistory: msg`History`,
    includeCategories: msg`Categories`,
    includeReadEntries: msg`All read entries`,
    includeAppSettings: msg`App settings`,
    includeExtensionStores: msg`Extension stores`,
    includeSourceSettings: msg`Source settings`,
    includePrivateSettings: msg`Include sensitive settings (e.g., tracker login tokens)`,
};

export const BACKUP_FLAG_GROUP_TO_TRANSLATION: Record<BackupFlagGroup, MessageDescriptor> = {
    [BackupFlagGroup.LIBRARY]: msg`Library`,
    [BackupFlagGroup.SETTINGS]: msg`Settings`,
};

export const BACKUP_FLAGS = Object.keys(BACKUP_FLAGS_TO_TRANSLATION) as readonly BackupFlag[];

export const BACKUP_FLAGS_BY_GROUP: Record<BackupFlagGroup, BackupFlag[]> = {
    [BackupFlagGroup.LIBRARY]: [
        'includeManga',
        'includeChapters',
        'includeTracking',
        'includeHistory',
        'includeCategories',
        'includeReadEntries',
    ],
    [BackupFlagGroup.SETTINGS]: [
        'includeAppSettings',
        'includeExtensionStores',
        'includeSourceSettings',
        'includePrivateSettings',
    ],
};

/**
 * 该开关当前是否可选。不可选时灰化，对齐 Mihon `BackupOptions.Entry.enabled`：
 * 库内作品之外的四项都以「库内作品」为前提；敏感设置只在有设置可脱敏时才有意义。
 *
 * 写成 `Record<BackupFlag, …>` 而不是一张稀疏表，是为了让备份开关增删时这里跟着
 * 编译报错 —— 漏一项的话那个开关会永远可点，用户勾了却什么都不会发生。
 */
export const BACKUP_FLAG_IS_ENABLED: Record<BackupFlag, (flags: BackupFlagInclusionState) => boolean> = {
    includeManga: () => true,
    includeCategories: () => true,
    includeChapters: ({ includeManga }) => includeManga,
    includeTracking: ({ includeManga }) => includeManga,
    includeHistory: ({ includeManga }) => includeManga,
    includeReadEntries: ({ includeManga }) => includeManga,
    includeAppSettings: () => true,
    includeExtensionStores: () => true,
    includeSourceSettings: () => true,
    includePrivateSettings: ({ includeAppSettings, includeSourceSettings }) =>
        includeAppSettings || includeSourceSettings,
};

/**
 * 这五类内容一项都没勾时，导出会得到一份空档、恢复也没有东西可恢复，此时不允许
 * 提交（对齐 Mihon `BackupOptions.canCreate` / `RestoreOptions.canRestore`，两者
 * 的表达式是同一个）。
 *
 * 注意它比 `BACKUP_FLAG_IS_ENABLED` 窄：章节、追踪、历史、已读作品再多也只能依附
 * 在库内作品上，不能单独构成一份备份。
 */
export const hasBackupContent = (flags: BackupFlagInclusionState): boolean =>
    flags.includeManga ||
    flags.includeCategories ||
    flags.includeAppSettings ||
    flags.includeExtensionStores ||
    flags.includeSourceSettings;
