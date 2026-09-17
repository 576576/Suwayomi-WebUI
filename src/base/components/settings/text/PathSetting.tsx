/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import { useLingui } from '@lingui/react/macro';
import type { TextSettingProps } from '@/base/components/settings/text/TextSetting.tsx';
import { TextSettingDialog } from '@/base/components/settings/text/TextSettingDialog.tsx';
import { copyToClipboard } from '@/lib/HelperFunctions.ts';

export type PathSettingProps = TextSettingProps & {
    /**
     * 行上展示的路径。
     *
     * 与 `value` 是两回事：`value` 是存进设置里的**原值**（没设置过就是空串）。
     * 没设置过时这里给的是 `[存储位置]/xxx` 这类占位文案 —— 一眼看出这个目录是
     * 从哪来的，而不是糊一长串路径。
     */
    displayedPath: string;
    /**
     * 整行单击时复制的内容，默认同 `displayedPath`。
     *
     * 默认态下要显式给：行上显示的是占位文案（复制下来没有意义），能真正拿去
     * 用的完整路径得由调用方按解析规则拼出来。
     */
    copyValue?: string;
    /**
     * 覆盖「点铅笔」的默认行为（默认打开文本编辑对话框）。
     *
     * Android 上用系统目录授权对话框替掉它（见 `lib/platform/AndroidBridge.ts`）。
     */
    onEdit?: () => void;
};

/**
 * 一条「目录路径」设置项（存储位置、下载位置……）。
 *
 * 与 [`TextSetting`] 的差别只在交互：**整行单击 = 复制路径**，右侧铅笔按钮才打开
 * 编辑对话框。这些路径日常用途是「抄下来粘进文件管理器/终端」，读远多于写，
 * 所以把单击让给复制。（`TextSetting` 保持原样不动 —— 用户名、密码那些没有
 * 复制需求，行单击开编辑更顺手。）
 */
export const PathSetting = ({
    displayedPath,
    copyValue = displayedPath,
    disabled = false,
    onEdit,
    ...props
}: PathSettingProps) => {
    const { t } = useLingui();

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <ListItemButton disabled={disabled} onClick={() => copyValue && void copyToClipboard(copyValue)}>
                <ListItemText
                    primary={props.settingName}
                    secondary={displayedPath}
                    slotProps={{
                        secondary: {
                            sx: { display: 'flex', flexDirection: 'column', wordWrap: 'break-word' },
                        },
                    }}
                />
                <Tooltip title={t`Edit`}>
                    <IconButton
                        edge="end"
                        disabled={disabled}
                        onClick={(event) => {
                            // 别让行上的「复制」也跟着触发
                            event.stopPropagation();
                            if (onEdit) {
                                onEdit();
                                return;
                            }
                            setIsDialogOpen(true);
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </ListItemButton>
            {onEdit ? null : (
                <TextSettingDialog
                    {...props}
                    disabled={disabled}
                    placeholder={props.placeholder ?? displayedPath}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )}
        </>
    );
};
