/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import type { SxProps, Theme } from '@mui/material/styles';
import { PublishingStatus, PublishingType } from '@/features/tracker/Tracker.types.ts';

export const DIALOG_PADDING: number = 2;

export const CARD_BACKGROUND: SxProps<Theme> = {
    backgroundColor: 'transparent',
    boxShadow: 'unset',
    backgroundImage: 'unset',
};

export const CARD_STYLING: SxProps<Theme> = {
    padding: DIALOG_PADDING,
    ...CARD_BACKGROUND,
};

export const PUBLISHING_TYPE_TO_TRANSLATION: Record<PublishingType, MessageDescriptor> = {
    [PublishingType.UNKNOWN]: msg`Unknown`,
    [PublishingType.MANGA]: msg`Manga`,
    [PublishingType.NOVEL]: msg`Novel`,
    [PublishingType.ONE_SHOT]: msg`Oneshot`,
    [PublishingType.DOUJINSHI]: msg`Doujinshi`,
    [PublishingType.MANHWA]: msg`Manhwa`,
    [PublishingType.MANHUA]: msg`Manhua`,
    [PublishingType.OEL]: msg`OEL`,
};

export const PUBLISHING_STATUS_TO_TRANSLATION: Record<PublishingStatus, MessageDescriptor> = {
    [PublishingStatus.FINISHED]: msg`Finished`,
    [PublishingStatus.RELEASING]: msg`Releasing`,
    [PublishingStatus.NOT_YET_RELEASED]: msg`Not yet released`,
    [PublishingStatus.CANCELLED]: msg`Cancelled`,
    [PublishingStatus.HIATUS]: msg`Hiatus`,
    [PublishingStatus.CURRENTLY_PUBLISHING]: msg`Currently publishing`,
    [PublishingStatus.NOT_YET_PUBLISHED]: msg`Not yet published`,
};

export const UNSET_DATE = '0';

/**
 * 弹窗认证完成后的通知通道名：回调页在弹窗里发，追踪设置页在主窗口收。
 * 支持 BroadcastChannel 就用它，否则退回同源 `postMessage`。
 */
export const TRACKER_OAUTH_CHANNEL = 'suwayomi-tracker-oauth';

/** 该用 BroadcastChannel 还是退回 `postMessage`（收发两端必须用同一个判断）。 */
export const CAN_BROADCAST_CHANNEL = typeof BroadcastChannel !== 'undefined';
