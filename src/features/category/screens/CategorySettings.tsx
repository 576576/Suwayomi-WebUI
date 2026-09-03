/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useLingui } from '@lingui/react/macro';
import { requestManager } from '@/lib/requests/RequestManager.ts';
import { DEFAULT_FULL_FAB_HEIGHT } from '@/base/components/buttons/StyledFab.tsx';
import { LoadingPlaceholder } from '@/base/components/feedback/LoadingPlaceholder.tsx';
import { EmptyViewAbsoluteCentered } from '@/base/components/feedback/EmptyViewAbsoluteCentered.tsx';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import type {
    GetCategoriesSettingsQuery,
    GetCategoriesSettingsQueryVariables,
} from '@/lib/graphql/generated/graphql.ts';
import { GET_CATEGORIES_SETTINGS } from '@/lib/graphql/category/CategoryQuery.ts';
import { CategorySettingsCard } from '@/features/category/components/CategorySettingsCard.tsx';
import type { CategoryIdInfo } from '@/features/category/Category.types.ts';
import { getErrorMessage, noOp } from '@/lib/HelperFunctions.ts';
import { DndSortableItem } from '@/lib/dnd-kit/DndSortableItem.tsx';
import { DndKitUtil } from '@/lib/dnd-kit/DndKitUtil.ts';
import { DndOverlayItem } from '@/lib/dnd-kit/DndOverlayItem.tsx';
import { useAppTitle } from '@/features/navigation-bar/hooks/useAppTitle.ts';
import { CREATE_NEW_CATEGORY_ID } from '@/features/category/Category.constants.ts';
import { CreateOrEditCategoryDialog } from '@/features/category/components/CreateOrEditCategoryDialog.tsx';

export function CategorySettings() {
    const { t } = useLingui();
    const dndSensors = DndKitUtil.useSensorsForDevice();

    useAppTitle(t`Edit categories`);

    const { data, loading, error, refetch } = requestManager.useGetCategories<
        GetCategoriesSettingsQuery,
        GetCategoriesSettingsQueryVariables
    >(GET_CATEGORIES_SETTINGS);
    const [reorderCategory, { reset: revertReorder }] = requestManager.useReorderCategory();

    const [categoryToEdit, setCategoryToEdit] = useState<number>(CREATE_NEW_CATEGORY_ID);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dndActiveCategory, setDndActiveCategory] = useState<
        ComponentProps<typeof CategorySettingsCard>['category'] | null
    >(null);

    // 默认分类（服务端 default=true，名称随服务端语言，不能按名字判断）始终
    // 置顶，且不参与排序 / 编辑 / 删除 —— 因此它不进 SortableContext，既不
    // 能被拖动，也不会被别的分类拖到它上面。
    const allCategories = useMemo(() => data?.categories.nodes ?? [], [data]);
    const defaultCategory = useMemo(() => allCategories.find((category) => category.default), [allCategories]);
    const sortableCategories = useMemo(() => allCategories.filter((category) => !category.default), [allCategories]);

    const categoryReorder = (list: CategoryIdInfo[], from: number, to: number) => {
        const reorderedCategory = list[from];

        // 默认分类占住第 0 位，可排序列表的下标 i 对应服务端位置 i + 1
        reorderCategory({ variables: { input: { id: reorderedCategory.id, position: to + 1 } } }).catch(() =>
            revertReorder(),
        );
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        setDndActiveCategory(null);

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = sortableCategories.findIndex((category) => category.id === active.id);
        const newIndex = sortableCategories.findIndex((category) => category.id === over.id);

        categoryReorder(sortableCategories, oldIndex, newIndex);
    };

    const handleDialogOpen = (categoryId?: CategoryIdInfo['id']) => {
        setCategoryToEdit(categoryId ?? CREATE_NEW_CATEGORY_ID);
        setDialogOpen(true);
    };

    const handleDialogCancel = () => {
        setCategoryToEdit(CREATE_NEW_CATEGORY_ID);
        setDialogOpen(false);
    };

    if (loading) {
        return <LoadingPlaceholder />;
    }

    if (error) {
        return (
            <EmptyViewAbsoluteCentered
                message={t`Could not load categories`}
                messageExtra={getErrorMessage(error)}
                retry={() => refetch().catch(defaultPromiseErrorHandler('CategorySettings::refetch'))}
            />
        );
    }

    return (
        <>
            <Box sx={{ paddingBottom: DEFAULT_FULL_FAB_HEIGHT }}>
                {defaultCategory && <CategorySettingsCard category={defaultCategory} isDefault onEdit={noOp} />}
                <DndContext
                    sensors={dndSensors}
                    collisionDetection={closestCenter}
                    onDragStart={(event) =>
                        setDndActiveCategory(
                            sortableCategories.find((category) => category.id === event.active.id) ?? null,
                        )
                    }
                    onDragEnd={onDragEnd}
                    onDragCancel={() => setDndActiveCategory(null)}
                    onDragAbort={() => setDndActiveCategory(null)}
                >
                    <SortableContext items={sortableCategories} strategy={verticalListSortingStrategy}>
                        {sortableCategories.map((category) => (
                            <DndSortableItem
                                key={category.id}
                                id={category.id}
                                isDragging={category.id === dndActiveCategory?.id}
                            >
                                <CategorySettingsCard
                                    category={category}
                                    onEdit={() => handleDialogOpen(category.id)}
                                />
                            </DndSortableItem>
                        ))}
                    </SortableContext>
                    <DndOverlayItem isActive={!!dndActiveCategory}>
                        <CategorySettingsCard category={dndActiveCategory!} onEdit={noOp} />
                    </DndOverlayItem>
                </DndContext>
            </Box>
            <Fab
                color="primary"
                aria-label="add"
                sx={{
                    position: 'fixed',
                    bottom: (theme) => theme.spacing(2),
                    right: (theme) => theme.spacing(2),
                }}
                onClick={() => handleDialogOpen()}
            >
                <AddIcon />
            </Fab>

            {dialogOpen && (
                <CreateOrEditCategoryDialog
                    category={allCategories.find((category) => category.id === categoryToEdit)}
                    onClose={handleDialogCancel}
                />
            )}
        </>
    );
}
