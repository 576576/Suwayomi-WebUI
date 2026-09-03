/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { d } from 'koration';
import { useLocalStorage } from '@/base/hooks/useStorage.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import '@/lib/koration/Setup';

const UPDATE_CHECK_INTERVAL = d(1).hours.inWholeMilliseconds;
const UPDATE_REMINDER_THRESHOLD = d(1).hours.inWholeMilliseconds;

export const useUpdateChecker = (
    storageKey: string,
    checkForUpdate: () => Promise<unknown>,
    version?: string,
    interval: number = UPDATE_CHECK_INTERVAL,
    /**
     * 「启动时检查更新」。开 = 每次打开 WebUI 立刻跑一次检查，之后再按周期轮询；
     * 关 = 启动时不做检查，只保留周期性检查（距上次检查超过一个周期时仍然会补跑）。
     */
    checkOnStartup: boolean = true,
): { handleUpdate: boolean; ignoreUpdate: () => void; remindLater: () => void } => {
    const [lastUpdateCheck, setLastUpdateCheck] = useLocalStorage(`UpdateChecker::${storageKey}::lastUpdateCheck`, 0);
    const [ignoreVersionUpdate, setIgnoreVersionUpdate] = useLocalStorage<string>(
        `UpdateChecker::${storageKey}::ignoreUpdate`,
    );
    const [updateClosedTimestamp, setUpdateClosedTimestamp] = useLocalStorage(
        `UpdateChecker::${storageKey}::closeTimestamp`,
        0,
    );

    useEffect(() => {
        // 距下一次周期性检查的剩余时间；从未检查过（lastUpdateCheck === 0）时
        // 视为「一个完整周期之后」，这样关闭「启动时检查更新」时首次运行也不会
        // 立刻发请求。
        const timeTillNextUpdateCheck =
            lastUpdateCheck > 0 ? Math.max(interval - (Date.now() - lastUpdateCheck), 0) : interval;
        const initialDelay = checkOnStartup ? 0 : timeTillNextUpdateCheck;

        let timeout: NodeJS.Timeout | undefined;
        const scheduleUpdateCheck = (timeoutMS: number) => {
            timeout = setTimeout(() => {
                checkForUpdate().catch(defaultPromiseErrorHandler(`UpdateChecker(${storageKey})::checkForUpdate`));
                setLastUpdateCheck(Date.now());
                scheduleUpdateCheck(interval);
            }, timeoutMS);
        };

        scheduleUpdateCheck(initialDelay);

        return () => clearTimeout(timeout);
    }, [storageKey, checkForUpdate, interval, checkOnStartup]);

    const ignoreUpdate = useCallback(() => {
        setIgnoreVersionUpdate(version);
    }, [storageKey, version]);

    const remindLater = useCallback(() => {
        setUpdateClosedTimestamp(Date.now());
    }, [storageKey]);

    const wasRecentlyClosed = Date.now() - updateClosedTimestamp < UPDATE_REMINDER_THRESHOLD;
    const wasUpdateIgnored = !!ignoreVersionUpdate && ignoreVersionUpdate === version;
    const handleUpdate = !wasRecentlyClosed && !wasUpdateIgnored;

    return useMemo(() => ({ handleUpdate, ignoreUpdate, remindLater }), [handleUpdate, ignoreUpdate, remindLater]);
};
