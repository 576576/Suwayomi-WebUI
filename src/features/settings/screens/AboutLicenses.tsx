/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useLingui } from '@lingui/react/macro';
import { SearchTextField } from '@/base/components/inputs/SearchTextField.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { getErrorMessage } from '@/lib/HelperFunctions.ts';
import type { LicensePackage, LicenseText } from '@/features/settings/AboutLicenses.types.ts';

/** A bare SPDX id — `MIT`, `Apache-2.0`, `0BSD` … — as opposed to an expression like `(MIT AND Zlib)`. */
const SPDX_ID_PATTERN = /^[A-Za-z0-9.+-]+$/;

const spdxUrl = (license: string): string | null =>
    SPDX_ID_PATTERN.test(license) ? `https://spdx.org/licenses/${license}.html` : null;

/**
 * Lists the license of the WebUI itself and of every production dependency that
 * ends up in the bundle.
 *
 * The data is generated at build time (see tools/scripts/generateLicenses.ts)
 * and imported dynamically: it is a few hundred KB, which must not land in the
 * chunk loaded on every page view.
 */
export function AboutLicenses() {
    const { t } = useLingui();

    useAppTitle(t`Open source licenses`);

    const [packages, setPackages] = useState<LicensePackage[] | null>(null);
    const [texts, setTexts] = useState<Record<string, string>>({});
    const [error, setError] = useState<unknown>(null);
    const [search, setSearch] = useState('');
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        import('@/assets/generated/licenses.ts')
            .then(({ LICENSE_PACKAGES, LICENSE_TEXTS }) => {
                if (cancelled) {
                    return;
                }

                setPackages(LICENSE_PACKAGES);
                setTexts(Object.fromEntries(LICENSE_TEXTS.map(({ id, text }: LicenseText) => [id, text])));
            })
            .catch((e) => !cancelled && setError(e));

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        if (!packages) {
            return null;
        }

        const needle = search.trim().toLowerCase();
        if (!needle) {
            return packages;
        }

        return packages.filter(({ name, license, author }) =>
            [name, license, author].some((value) => value?.toLowerCase().includes(needle)),
        );
    }, [packages, search]);

    const licenseCount = useMemo(
        () => (packages ? new Set(packages.map(({ license }) => license)).size : 0),
        [packages],
    );

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Unable to load data`}
                messageExtra={getErrorMessage(error)}
                retry={() => window.location.reload()}
            />
        );
    }

    if (!packages || !filtered) {
        return <LoadingPlaceholder />;
    }

    return (
        <Box sx={{ p: 2 }}>
            <SearchTextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onCancel={() => setSearch('')}
                placeholder={t`Search`}
                sx={{ width: '100%' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                {t`Components`}: {packages.length} · {t`Licenses`}: {licenseCount}
                {search.trim() && filtered.length !== packages.length ? ` · ${t`Matches`}: ${filtered.length}` : ''}
            </Typography>
            <List sx={{ pt: 0 }}>
                {filtered.map(({ name, version, license, homepage, textId }) => {
                    const isExpanded = expanded === name;
                    const text = textId ? texts[textId] : undefined;
                    const url = spdxUrl(license);

                    return (
                        <Box key={name}>
                            <ListItemButton onClick={() => setExpanded(isExpanded ? null : name)}>
                                <ListItemText
                                    primary={name}
                                    secondary={[version, homepage].filter(Boolean).join(' — ')}
                                    slotProps={{ primary: { sx: { wordBreak: 'break-all' } } }}
                                />
                                <Chip label={license} size="small" sx={{ ml: 1, flexShrink: 0 }} />
                            </ListItemButton>
                            {isExpanded && (
                                <Collapse in appear>
                                    <Box sx={{ px: 2, pb: 2 }}>
                                        {text ? (
                                            <Typography
                                                component="pre"
                                                sx={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    fontFamily: 'monospace',
                                                    fontSize: '0.75rem',
                                                    m: 0,
                                                }}
                                            >
                                                {text}
                                            </Typography>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                {t`This package does not ship a license file.`}{' '}
                                                {url ? (
                                                    <Link href={url} target="_blank" rel="noreferrer">
                                                        {license}
                                                    </Link>
                                                ) : (
                                                    license
                                                )}
                                            </Typography>
                                        )}
                                    </Box>
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </List>
        </Box>
    );
}
