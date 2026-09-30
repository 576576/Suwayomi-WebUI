/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { FieldFunctionOptions } from '@apollo/client/cache';
import type { Reference } from '@apollo/client/utilities';
import type { GqlMeta } from '@/features/metadata/Metadata.types.ts';

type ReadFieldFunction = FieldFunctionOptions['readField'];

export const updateMetadataList = (
    meta: GqlMeta[],
    existingMetas: Reference[] | undefined,
    readField: ReadFieldFunction,
    createMetaRef: (meta: GqlMeta) => Reference | undefined,
    deleted: boolean = false,
) => {
    if (!existingMetas) {
        return existingMetas;
    }

    if (deleted) {
        return existingMetas.filter((metaRef: Reference) => meta.some(({ key }) => key === readField('key', metaRef)));
    }

    const newMetas = meta.filter(({ key }) =>
        existingMetas.every((metaRef: Reference) => readField('key', metaRef) !== key),
    );
    const newMetaRefs = newMetas.map(createMetaRef);

    return [...existingMetas, ...newMetaRefs];
};
