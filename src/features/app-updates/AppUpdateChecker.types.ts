/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export type MetadataUpdateSettings = {
    /** Master switch for all update dialogs: server/WebUI "available" and "updated" popups. */
    informAboutUpdates: boolean;
    /**
     * Whether an update check runs right when the WebUI starts.
     * Off (default) = the first check is deferred by a full update-check interval;
     * the periodic check and the manual check on the About page are unaffected.
     */
    checkForUpdatesOnStartup: boolean;
};
