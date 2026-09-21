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

/** 站点应用凭据（`trackers.json`）。这两个字段/入口都是 Suwayomi-next 自己加的。 */
export type TrackerOAuthApp = {
    __typename?: 'TrackerOAuthAppType';
    clientId: string;
    clientSecret: string;
    redirectUri: string;
};

/** `oauthApp` 不在上游 schema 里，单独一个 query 取，别动 `generated/` 用的那些片段。 */
export type TrackerOAuthAppsQuery = {
    __typename?: 'Query';
    trackers: {
        __typename?: 'TrackerNodeList';
        nodes: {
            __typename?: 'TrackerType';
            id: number;
            oauthApp: TrackerOAuthApp | null;
        }[];
    };
};

export type TrackerUpdateOAuthAppMutationVariables = {
    input: {
        trackerId: number;
        clientId?: string | null;
        clientSecret?: string | null;
        redirectUri?: string | null;
        clientMutationId?: string | null;
    };
};

export type TrackerUpdateOAuthAppMutation = {
    __typename?: 'Mutation';
    updateTrackerOAuthApp: {
        __typename?: 'UpdateTrackerOAuthAppPayload';
        tracker: TrackerType;
    };
};
