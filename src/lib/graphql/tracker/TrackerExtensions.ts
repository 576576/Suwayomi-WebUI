/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { TrackerType } from '@/lib/graphql/generated/graphql-base.types.ts';

/**
 * `refreshTrackerUser` 是 Suwayomi-next 自己加的（上游 Suwayomi 没有这个 mutation，
 * 对应 Mihon `BaseTracker.refreshUser()`），所以 `generated/` 里没有它的类型。
 */
export type TrackerRefreshUserMutationVariables = {
    input: {
        trackerId: number;
        clientMutationId?: string | null;
    };
};

export type TrackerRefreshUserMutation = {
    __typename?: 'Mutation';
    refreshTrackerUser: {
        __typename?: 'RefreshTrackerUserPayload';
        tracker: TrackerType;
    };
};
