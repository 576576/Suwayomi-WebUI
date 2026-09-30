/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { t } from '@lingui/core/macro';

export type VersionInfoProps = {
    version: string;
    isCheckingForUpdate: boolean;
    isUpdateAvailable: boolean;
    updateCheckError: any;
    checkForUpdate: () => void;
    url: string;
};

const getUpdateCheckButtonIcon = (isLoading: boolean, isUpdateAvailable: boolean) => {
    if (isLoading) {
        return <CircularProgress size={15} />;
    }

    return isUpdateAvailable ? <OpenInNewIcon /> : <RefreshIcon />;
};

const getUpdateCheckButtonText = (isLoading: boolean, isUpdateAvailable: boolean, error: any) => {
    if (isLoading) {
        return t`Checking for update`;
    }

    if (error) {
        return t`Could not check for update`;
    }

    if (isUpdateAvailable) {
        return t`Update available`;
    }

    return t`This is the latest version`;
};

/**
 * 服务端与 WebUI 各一行「版本 + 检查更新」。更新本身不在这里触发 —— WebUI 的产物
 * 由桌面托盘负责替换，所以这里只能重新检查、或跳到发布页。
 */
export const VersionInfo = ({
    version,
    isCheckingForUpdate,
    isUpdateAvailable,
    updateCheckError,
    checkForUpdate,
    url,
}: VersionInfoProps) => {
    const onClick = () => {
        if (!isUpdateAvailable || updateCheckError) {
            checkForUpdate();
        }
    };

    return (
        <Stack
            sx={{
                alignItems: 'start',
            }}
        >
            <Typography component="span" variant="body2">
                {version}
            </Typography>
            <Button
                sx={{
                    marginTop: '5px',
                    backgroundColor: 'transparent',
                }}
                size="small"
                variant="outlined"
                startIcon={getUpdateCheckButtonIcon(isCheckingForUpdate, isUpdateAvailable)}
                onClick={onClick}
                {...(isUpdateAvailable
                    ? {
                          href: url,
                          target: '_blank',
                      }
                    : undefined)}
            >
                {getUpdateCheckButtonText(isCheckingForUpdate, isUpdateAvailable, updateCheckError)}
            </Button>
        </Stack>
    );
};
