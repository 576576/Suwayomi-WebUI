/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { PartialBackupFlagsInput } from '@/lib/graphql/generated/graphql-base.types.ts';
import type { ServerSettings } from '@/features/settings/Settings.types.ts';

export enum BackupFlagGroup {
    LIBRARY = 'library',
    SETTINGS = 'settings',
}

/**
 * 服务端仍接受这两个已废弃的字段（旧客户端在传），但界面上不再有对应开关 ——
 * 它们的语义已经并入「应用设置」。
 */
export type BackupFlag = Exclude<keyof PartialBackupFlagsInput, 'includeClientData' | 'includeServerSettings'>;

export type BackupFlagInclusionState = Record<BackupFlag, boolean>;

export type AutoBackupFlag = Pick<
    ServerSettings,
    | 'autoBackupIncludeAppSettings'
    | 'autoBackupIncludeCategories'
    | 'autoBackupIncludeChapters'
    | 'autoBackupIncludeExtensionStores'
    | 'autoBackupIncludeHistory'
    | 'autoBackupIncludeManga'
    | 'autoBackupIncludePrivateSettings'
    | 'autoBackupIncludeReadEntries'
    | 'autoBackupIncludeSourceSettings'
    | 'autoBackupIncludeTracking'
>;

export type AutoBackupFlagInclusionState = Record<keyof AutoBackupFlag, boolean>;

export type BackupSettingsType = Pick<ServerSettings, 'dataDir' | 'autoBackupFrequency' | keyof AutoBackupFlag>;
