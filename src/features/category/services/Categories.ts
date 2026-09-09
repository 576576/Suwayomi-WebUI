/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { t } from '@lingui/core/macro';
import type { CategoryDefaultInfo, CategoryIdInfo, CategoryNameInfo } from '@/features/category/Category.types.ts';

export const DEFAULT_CATEGORY_ID = 0;

/**
 * 判定默认分类所需的最小字段集。`name`/`default` 是可选的：调用点有的只持有
 * `id + name`（如分类设置卡片），有的持有完整的 `CategoryType`。
 */
type CategoryDisplayInfo = CategoryIdInfo & Partial<CategoryNameInfo> & Partial<CategoryDefaultInfo>;

export class Categories {
    static getIds(categories: CategoryIdInfo[]): number[] {
        return categories.map((category) => category.id);
    }

    static getUserCreated<Category extends CategoryIdInfo>(categories: Category[]): Category[] {
        return categories.filter((category) => category.id !== DEFAULT_CATEGORY_ID);
    }

    static getDefaults<Category extends CategoryDefaultInfo>(categories: Category[]): Category[] {
        return categories.filter((category) => category.default);
    }

    /**
     * 分类的展示名。默认分类（id 0 / `default` 标志）在数据库里的名字恒为英文
     * `Default`（服务端 `CategoryService::DEFAULT_CATEGORY_NAME`），直接渲染就是
     * 未本地化的英文，因此统一在这里覆盖成本地化文案。
     *
     * 判定用 id + default 标志而非名称字面量：即使将来该分类被改名，或库来自
     * 其它语言环境，仍能正确本地化。
     */
    static getName(category: CategoryDisplayInfo): string {
        if (category.id === DEFAULT_CATEGORY_ID || category.default) {
            return t`Default`;
        }

        return category.name ?? '';
    }
}
