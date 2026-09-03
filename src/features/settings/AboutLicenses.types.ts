/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/**
 * A deduplicated license text.
 *
 * Many packages ship byte-identical license files (MIT alone accounts for
 * hundreds of them), so texts are stored once and referenced by id instead of
 * being repeated per package — that keeps the generated data around half the
 * size it would otherwise be.
 */
export type LicenseText = {
    id: string;
    /** SPDX expression the text was filed under. Only used for display / grouping. */
    license: string;
    text: string;
};

export type LicensePackage = {
    name: string;
    version: string;
    /** SPDX expression as declared by the package. May be an expression, e.g. `(MIT AND Zlib)`. */
    license: string;
    author?: string;
    homepage?: string;
    /**
     * Id of the {@link LicenseText} shipped by this package, or `null` when the
     * published tarball contains no license file — in that case only the SPDX
     * expression above can be shown.
     */
    textId: string | null;
};
