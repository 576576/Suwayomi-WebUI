/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import * as path from 'path';

// Writes build/version.txt — three lines: tag / channel / build timestamp (Unix seconds).
// This is the only source the server reads for aboutWebUI() and checkForWebUIUpdate()
// (see local_webui_* in Suwayomi-next), so it must exist for every build, not just the
// zip produced by CI.
//
// CI pins both values via SUWAYOMI_WEBUI_TAG / SUWAYOMI_WEBUI_CHANNEL. Local builds
// default to r{commitCount} + the `local` channel, so a hand-built WebUI is tellable
// apart from a CI artifact in Settings → Advanced → Debug information.

const BUILD_DIR = path.resolve(import.meta.dirname, '../../build');

const commitCount = (): string => {
    try {
        return execSync('git rev-list HEAD --count', { encoding: 'utf8' }).trim();
    } catch {
        // no git (tarball build / shallow checkout) — fall back instead of failing the build
        return '0';
    }
};

const tag = process.env.SUWAYOMI_WEBUI_TAG?.trim() || `r${commitCount()}`;
const channel = process.env.SUWAYOMI_WEBUI_CHANNEL?.trim() || 'local';
const buildTime = Math.floor(Date.now() / 1000).toString();

fs.mkdirSync(BUILD_DIR, { recursive: true });
fs.writeFileSync(path.join(BUILD_DIR, 'version.txt'), `${tag}\n${channel}\n${buildTime}\n`);

// the zip name embeds the tag (see build-zip in package.json), so hand it back to the shell
console.log(tag);
