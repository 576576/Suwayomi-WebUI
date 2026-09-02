/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Warning from '@mui/icons-material/Warning';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { isNetworkRequestInFlight } from '@apollo/client/utilities';
import { useLingui } from '@lingui/react/macro';
import { CustomTooltip } from '@/base/components/CustomTooltip.tsx';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { ChapterList } from '@/features/chapter/components/ChapterList.tsx';
import { useRefreshManga } from '@/features/manga/hooks/useRefreshManga.ts';
import { MangaDetails } from '@/features/manga/components/details/MangaDetails.tsx';
import { MangaToolbarMenu } from '@/features/manga/components/MangaToolbarMenu.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import type { GetMangaScreenQuery } from '@/lib/graphql/generated/graphql.ts';
import { GET_MANGA_SCREEN } from '@/lib/graphql/manga/MangaQuery.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { STABLE_EMPTY_OBJECT } from '@/base/Base.constants.ts';
import { useAppTitleAndAction } from '@/features/navigation-bar/hooks/useAppTitleAndAction.ts';
import type { MangaLocationState } from '@/features/manga/Manga.types.ts';

const refreshMangaChaptersList = () =>
    requestManager.graphQLClient.client
        .refetchQueries({ include: ['GET_CHAPTERS_MANGA'] })
        .catch(defaultPromiseErrorHandler('Manga::refreshChapters'));

export const Manga: React.FC = () => {
    const { t } = useLingui();
    const { id } = useParams<{ id: string }>();
    const { mode } = useLocation<MangaLocationState>().state ?? STABLE_EMPTY_OBJECT;

    const autofetchedRef = useRef(false);

    const {
        data,
        error: mangaError,
        loading: isLoading,
        networkStatus,
        refetch,
    } = requestManager.useGetManga<GetMangaScreenQuery>(GET_MANGA_SCREEN, id);
    const isValidating = isNetworkRequestInFlight(networkStatus);
    const manga = data?.manga;

    const [refresh, { loading: refreshing, error: refreshError }] = useRefreshManga(id);

    const error = mangaError ?? refreshError;

    // Observe the download queue (refreshed app-wide every 2s). Once the
    // queue drains (a download finished) the chapter list query is refetched
    // so the cards flip to their real isDownloaded state.
    const { data: downloadStatusData } = requestManager.useGetDownloadStatus();
    const downloadQueueLength = downloadStatusData?.downloadStatus?.queue.length;
    const refreshChaptersListRef = useRef(refreshMangaChaptersList);
    refreshChaptersListRef.current = refreshMangaChaptersList;
    const wasDownloading = useRef(false);
    useEffect(() => {
        const hadItems = wasDownloading.current;
        const hasItems = (downloadQueueLength ?? 0) > 0;
        wasDownloading.current = hasItems;
        if (hadItems && !hasItems) {
            refreshChaptersListRef.current();
        }
    }, [downloadQueueLength]);

    // Fast downloads can finish between two queue polls, so when a chapter is
    // enqueued, refresh the chapter list a few times — the cards flip to
    // "downloaded" as soon as the server has finished, no matter how quick the
    // download was.
    const pendingRefetchTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    useEffect(
        () =>
            requestManager.onDownloadStarted(() => {
                pendingRefetchTimers.current.push(
                    ...[0, 1200, 2500, 4000, 6000, 9000].map((delay) =>
                        setTimeout(() => refreshChaptersListRef.current(), delay),
                    ),
                );
            }),
        [],
    );
    useEffect(
        () => () => {
            pendingRefetchTimers.current.forEach(clearTimeout);
        },
        [],
    );

    useEffect(() => {
        if (manga == null) {
            return;
        }

        const doFetch = !autofetchedRef.current && !manga.initialized;
        if (doFetch) {
            autofetchedRef.current = true;
            refresh();
        }
    }, [manga]);

    useAppTitleAndAction(
        manga?.title ?? t`Manga`,
        <Stack
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            {!!error && !isValidating && !refreshing && (
                <CustomTooltip
                    title={
                        <>
                            {t`Could not load manga`}
                            <br />
                            {getErrorMessage(error)}
                        </>
                    }
                >
                    <IconButton onClick={() => refetch()}>
                        <Warning color="error" />
                    </IconButton>
                </CustomTooltip>
            )}
            {manga && (refreshing || isValidating) && (
                <IconButton disabled>
                    <CircularProgress size={16} />
                </IconButton>
            )}
            {manga && <MangaToolbarMenu manga={manga} onRefresh={refresh} refreshing={refreshing} />}
        </Stack>,
        [t, error, isValidating, refreshing, manga, refresh],
    );

    if (error && !manga) {
        return <EmptyViewAbsoluteCentered message={t`Could not load manga`} messageExtra={getErrorMessage(error)} />;
    }
    return (
        <Box sx={{ display: { md: 'flex' }, overflow: 'hidden' }}>
            {isLoading && <LoadingPlaceholder />}

            {manga && <MangaDetails manga={manga} mode={mode} />}
            {manga && <ChapterList manga={manga} isRefreshing={refreshing} />}
        </Box>
    );
};
