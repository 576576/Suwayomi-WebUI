/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import FolderIcon from '@mui/icons-material/Folder';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { translateExtensionLanguage } from '@/features/extension/Extensions.utils.ts';
import { MigrationManager } from '@/features/migration/MigrationManager.ts';
import { ListCardAvatar } from '@/base/components/lists/cards/ListCardAvatar.tsx';
import { ListCardContent } from '@/base/components/lists/cards/ListCardContent.tsx';
import { Sources } from '@/features/source/services/Sources';
import type { TMigratableSource } from '@/features/migration/Migration.types.ts';
import { ReactRouter } from '@/lib/react-router/ReactRouter.ts';
import { AppRoutes } from '@/base/AppRoute.constants.ts';
import { memo } from 'react';

export const MigrationCard = memo((source: TMigratableSource) => {
    const { id, name, lang, iconUrl, mangaCount } = source;
    const { t } = useLingui();

    const sourceName = Sources.isLocalSource(source) ? t`Local source` : name;

    return (
        <Card>
            <CardActionArea
                onClick={() => {
                    MigrationManager.selectSources([id]);
                    ReactRouter.navigate(AppRoutes.migrate.path);
                }}
            >
                <ListCardContent sx={{ justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {Sources.isLocalSource(source) ? (
                            // 本地源没有扩展图标——以文件夹图标作为封面；
                            // 颜色跟随主题文本色（深色=白、浅色=黑）
                            <Avatar
                                variant="rounded"
                                sx={{ width: 56, height: 56, flex: '0 0 auto', background: 'transparent' }}
                            >
                                <FolderIcon fontSize="large" sx={{ color: 'text.primary' }} />
                            </Avatar>
                        ) : (
                            <ListCardAvatar
                                iconUrl={requestManager.getValidImgUrlFor(iconUrl)}
                                alt={sourceName}
                                slots={{
                                    spinnerImageProps: {
                                        ignoreQueue: true,
                                    },
                                }}
                            />
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <Typography variant="h6" component="h3">
                                {sourceName}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: 'block',
                                }}
                            >
                                {translateExtensionLanguage(lang)}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip sx={{ borderRadius: 1 }} size="small" label={mangaCount} />
                </ListCardContent>
            </CardActionArea>
        </Card>
    );
});
