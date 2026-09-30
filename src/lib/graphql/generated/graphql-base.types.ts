export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    Cursor: { input: string; output: string };
    Duration: { input: string; output: string };
    LongString: { input: string; output: string };
    Upload: { input: unknown; output: unknown };
};

/** Mirrors `AboutServerPayload` — full field set. */
export type AboutServerPayload = {
    __typename?: 'AboutServerPayload';
    /**
     * 发布根（exe 在 `bin/` 下时是它的上级）。Suwayomi-next 扩展字段：设置里可以填
     * `%APPDIR%` 占位符，WebUI 要用它把占位符还原成能直接用的绝对路径。
     */
    appDir: Scalars['String']['output'];
    /**
     * appdata 根（缓存 / 库 / 设置 / 扩展的父目录）。Suwayomi-next 扩展字段：WebUI
     * 「数据与存储」页只读展示 —— 它决定数据库放在哪，改不了也存不进库里。
     */
    appdataDir: Scalars['String']['output'];
    buildTime: Scalars['LongString']['output'];
    buildType: Scalars['String']['output'];
    /**
     * User data root (backups/downloads/local source live under it) —
     * displayed by the WebUI "Data & Storage" settings page.
     */
    dataDir: Scalars['String']['output'];
    discord: Scalars['String']['output'];
    github: Scalars['String']['output'];
    /**
     * Epoch seconds of the last automatic backup (0 = never ran yet).
     * Suwayomi-next 扩展字段：WebUI「数据与存储」页在自动备份频率下显示为副标题。
     */
    lastAutoBackupAt: Scalars['LongString']['output'];
    name: Scalars['String']['output'];
    platformInfo: PlatformInfo;
    /** @deprecated The version includes the revision as the patch number */
    revision: Scalars['String']['output'];
    version: Scalars['String']['output'];
};

export type AboutWebUi = {
    __typename?: 'AboutWebUI';
    /** Build time as Unix epoch seconds (line 3 of version.txt; 0 when absent). */
    buildTime: Scalars['LongString']['output'];
    channel: WebUiChannel;
    tag: Scalars['String']['output'];
    updateTimestamp: Scalars['LongString']['output'];
};

export type AddExtensionStoreInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    indexUrl: Scalars['String']['input'];
};

export type AddExtensionStorePayload = {
    __typename?: 'AddExtensionStorePayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extensionStore: ExtensionStoreType;
};

export enum AuthMode {
    BasicAuth = 'BASIC_AUTH',
    None = 'NONE',
    SimpleLogin = 'SIMPLE_LOGIN',
    UiLogin = 'UI_LOGIN',
}

export enum BackupRestoreState {
    Failure = 'FAILURE',
    Idle = 'IDLE',
    RestoringCategories = 'RESTORING_CATEGORIES',
    RestoringManga = 'RESTORING_MANGA',
    RestoringMeta = 'RESTORING_META',
    RestoringSettings = 'RESTORING_SETTINGS',
    Success = 'SUCCESS',
}

export type BackupRestoreStatus = {
    __typename?: 'BackupRestoreStatus';
    mangaProgress: Scalars['Int']['output'];
    state: BackupRestoreState;
    totalManga: Scalars['Int']['output'];
};

export type BindTrackInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    mangaId: Scalars['Int']['input'];
    private?: InputMaybe<Scalars['Boolean']['input']>;
    remoteId: Scalars['LongString']['input'];
    trackerId: Scalars['Int']['input'];
};

export type BindTrackPayload = {
    __typename?: 'BindTrackPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecord: TrackRecordType;
};

export type BindTrackRecordInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    mangaId: Scalars['Int']['input'];
    trackRecordId: Scalars['Int']['input'];
};

export type BindTrackRecordPayload = {
    __typename?: 'BindTrackRecordPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecord: TrackRecordType;
};

export type BooleanFilterInput = {
    distinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
    distinctFromAll?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    distinctFromAny?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    equalTo?: InputMaybe<Scalars['Boolean']['input']>;
    greaterThan?: InputMaybe<Scalars['Boolean']['input']>;
    greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
    in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<Scalars['Boolean']['input']>;
    lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
    notDistinctFrom?: InputMaybe<Scalars['Boolean']['input']>;
    notEqualTo?: InputMaybe<Scalars['Boolean']['input']>;
    notEqualToAll?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    notEqualToAny?: InputMaybe<Array<Scalars['Boolean']['input']>>;
    notIn?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Mirrors `CategoryCondition` (core). */
export type CategoryConditionInput = {
    default?: InputMaybe<Scalars['Boolean']['input']>;
    id?: InputMaybe<Scalars['Int']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryEdge = {
    __typename?: 'CategoryEdge';
    cursor: Scalars['Cursor']['output'];
    node: CategoryType;
};

export type CategoryFilterInput = {
    and?: InputMaybe<Array<CategoryFilterInput>>;
    default?: InputMaybe<BooleanFilterInput>;
    id?: InputMaybe<IntFilterInput>;
    name?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<CategoryFilterInput>;
    or?: InputMaybe<Array<CategoryFilterInput>>;
    order?: InputMaybe<IntFilterInput>;
};

export enum CategoryJobStatus {
    Skipped = 'SKIPPED',
    Updating = 'UPDATING',
}

export type CategoryMetaType = {
    __typename?: 'CategoryMetaType';
    category: CategoryType;
    categoryId: Scalars['Int']['output'];
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};

export type CategoryMetaTypeInput = {
    categoryId: Scalars['Int']['input'];
    key: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

export type CategoryNodeList = {
    __typename?: 'CategoryNodeList';
    edges: Array<CategoryEdge>;
    nodes: Array<CategoryType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum CategoryOrderBy {
    Id = 'ID',
    Name = 'NAME',
    Order = 'ORDER',
}

/** Mirrors `CategoryOrderInput` (shape parity; currently unused by categories). */
export type CategoryOrderInput = {
    by: CategoryOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type CategoryType = {
    __typename?: 'CategoryType';
    default: Scalars['Boolean']['output'];
    id: Scalars['Int']['output'];
    includeInDownload: IncludeOrExclude;
    includeInUpdate: IncludeOrExclude;
    mangas: MangaNodeList;
    meta: Array<CategoryMetaType>;
    name: Scalars['String']['output'];
    order: Scalars['Int']['output'];
};

export type CategoryUpdateType = {
    __typename?: 'CategoryUpdateType';
    category: CategoryType;
    status: CategoryJobStatus;
};

export enum CbzMediaType {
    Compatible = 'COMPATIBLE',
    Legacy = 'LEGACY',
    Modern = 'MODERN',
}

/** Mirrors `ChapterCondition` (core filters). */
export type ChapterConditionInput = {
    id?: InputMaybe<Scalars['Int']['input']>;
    mangaId?: InputMaybe<Scalars['Int']['input']>;
    sourceOrder?: InputMaybe<Scalars['Int']['input']>;
};

export type ChapterDownloadReorderInput = {
    chapterId: Scalars['Int']['input'];
    to: Scalars['Int']['input'];
};

export type ChapterEdge = {
    __typename?: 'ChapterEdge';
    cursor: Scalars['Cursor']['output'];
    node: ChapterType;
};

export type ChapterFilterInput = {
    and?: InputMaybe<Array<ChapterFilterInput>>;
    chapterNumber?: InputMaybe<DoubleFilterInput>;
    fetchedAt?: InputMaybe<LongFilterInput>;
    id?: InputMaybe<IntFilterInput>;
    inLibrary?: InputMaybe<BooleanFilterInput>;
    isBookmarked?: InputMaybe<BooleanFilterInput>;
    isDownloaded?: InputMaybe<BooleanFilterInput>;
    isRead?: InputMaybe<BooleanFilterInput>;
    lastPageRead?: InputMaybe<IntFilterInput>;
    lastReadAt?: InputMaybe<LongFilterInput>;
    mangaId?: InputMaybe<IntFilterInput>;
    name?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<ChapterFilterInput>;
    or?: InputMaybe<Array<ChapterFilterInput>>;
    pageCount?: InputMaybe<IntFilterInput>;
    realUrl?: InputMaybe<StringFilterInput>;
    scanlator?: InputMaybe<StringFilterInput>;
    sourceOrder?: InputMaybe<IntFilterInput>;
    uploadDate?: InputMaybe<LongFilterInput>;
    url?: InputMaybe<StringFilterInput>;
};

export type ChapterMetaType = {
    __typename?: 'ChapterMetaType';
    chapterId: Scalars['Int']['output'];
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};

export type ChapterMetaTypeInput = {
    chapterId: Scalars['Int']['input'];
    key: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

export type ChapterNodeList = {
    __typename?: 'ChapterNodeList';
    edges: Array<ChapterEdge>;
    nodes: Array<ChapterType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum ChapterOrderBy {
    ChapterNumber = 'CHAPTER_NUMBER',
    FetchedAt = 'FETCHED_AT',
    Id = 'ID',
    LastReadAt = 'LAST_READ_AT',
    MangaId = 'MANGA_ID',
    Name = 'NAME',
    SourceOrder = 'SOURCE_ORDER',
    UploadDate = 'UPLOAD_DATE',
}

/** Mirrors `ChapterOrderInput` (shape parity; currently unused by chapters). */
export type ChapterOrderInput = {
    by: ChapterOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type ChapterType = {
    __typename?: 'ChapterType';
    chapterNumber: Scalars['Float']['output'];
    fetchedAt: Scalars['LongString']['output'];
    id: Scalars['Int']['output'];
    isBookmarked: Scalars['Boolean']['output'];
    isDownloaded: Scalars['Boolean']['output'];
    isRead: Scalars['Boolean']['output'];
    lastPageRead: Scalars['Int']['output'];
    lastReadAt: Scalars['LongString']['output'];
    manga: MangaType;
    mangaId: Scalars['Int']['output'];
    meta: Array<ChapterMetaType>;
    name: Scalars['String']['output'];
    pageCount: Scalars['Int']['output'];
    realUrl?: Maybe<Scalars['String']['output']>;
    scanlator?: Maybe<Scalars['String']['output']>;
    sourceOrder: Scalars['Int']['output'];
    uploadDate: Scalars['LongString']['output'];
    url: Scalars['String']['output'];
};

export type CheckBoxFilter = {
    __typename?: 'CheckBoxFilter';
    default: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
};

export type CheckBoxPreference = {
    __typename?: 'CheckBoxPreference';
    currentValue?: Maybe<Scalars['Boolean']['output']>;
    default: Scalars['Boolean']['output'];
    enabled: Scalars['Boolean']['output'];
    key?: Maybe<Scalars['String']['output']>;
    summary?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    visible: Scalars['Boolean']['output'];
};

export type CheckForServerUpdatesPayload = {
    __typename?: 'CheckForServerUpdatesPayload';
    channel: Scalars['String']['output'];
    tag: Scalars['String']['output'];
    url: Scalars['String']['output'];
};

export type ClearCachedImagesInput = {
    cachedPages?: InputMaybe<Scalars['Boolean']['input']>;
    cachedThumbnails?: InputMaybe<Scalars['Boolean']['input']>;
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    downloadedThumbnails?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ClearCachedImagesPayload = {
    __typename?: 'ClearCachedImagesPayload';
    cachedPages?: Maybe<Scalars['Boolean']['output']>;
    cachedThumbnails?: Maybe<Scalars['Boolean']['output']>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadedThumbnails?: Maybe<Scalars['Boolean']['output']>;
};

export type ClearCookiesAndCacheInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ClearCookiesAndCachePayload = {
    __typename?: 'ClearCookiesAndCachePayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type ClearDownloaderInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ClearDownloaderPayload = {
    __typename?: 'ClearDownloaderPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type ConnectKoSyncAccountInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    password: Scalars['String']['input'];
    serverAddress: Scalars['String']['input'];
    username: Scalars['String']['input'];
};

/** Mirrors `ContentWarning` enum (source/extension content rating). */
export enum ContentWarning {
    Mixed = 'MIXED',
    Nsfw = 'NSFW',
    Safe = 'SAFE',
}

export type ContentWarningFilterInput = {
    distinctFrom?: InputMaybe<ContentWarning>;
    distinctFromAll?: InputMaybe<Array<ContentWarning>>;
    distinctFromAny?: InputMaybe<Array<ContentWarning>>;
    equalTo?: InputMaybe<ContentWarning>;
    greaterThan?: InputMaybe<ContentWarning>;
    greaterThanOrEqualTo?: InputMaybe<ContentWarning>;
    in?: InputMaybe<Array<ContentWarning>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<ContentWarning>;
    lessThanOrEqualTo?: InputMaybe<ContentWarning>;
    notDistinctFrom?: InputMaybe<ContentWarning>;
    notEqualTo?: InputMaybe<ContentWarning>;
    notEqualToAll?: InputMaybe<Array<ContentWarning>>;
    notEqualToAny?: InputMaybe<Array<ContentWarning>>;
    notIn?: InputMaybe<Array<ContentWarning>>;
};

export type CreateBackupInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    flags?: InputMaybe<PartialBackupFlagsInput>;
};

export type CreateBackupPayload = {
    __typename?: 'CreateBackupPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    url: Scalars['String']['output'];
};

export type CreateCategoryInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    default?: InputMaybe<Scalars['Boolean']['input']>;
    includeInDownload?: InputMaybe<IncludeOrExclude>;
    includeInUpdate?: InputMaybe<IncludeOrExclude>;
    name: Scalars['String']['input'];
    order?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCategoryPayload = {
    __typename?: 'CreateCategoryPayload';
    category: CategoryType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export enum DatabaseType {
    H2 = 'H2',
    Postgresql = 'POSTGRESQL',
}

export type DeleteCategoryInput = {
    categoryId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteCategoryMetaInput = {
    categoryId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    key: Scalars['String']['input'];
};

export type DeleteCategoryMetaPayload = {
    __typename?: 'DeleteCategoryMetaPayload';
    category: CategoryType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta?: Maybe<CategoryMetaType>;
};

export type DeleteCategoryMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<DeleteCategoryMetasItemInput>;
};

export type DeleteCategoryMetasItemInput = {
    categoryIds: Array<Scalars['Int']['input']>;
    keys?: InputMaybe<Array<Scalars['String']['input']>>;
    prefixes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeleteCategoryMetasPayload = {
    __typename?: 'DeleteCategoryMetasPayload';
    categories: Array<CategoryType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<CategoryMetaType>;
};

export type DeleteCategoryPayload = {
    __typename?: 'DeleteCategoryPayload';
    category?: Maybe<CategoryType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    mangas: Array<MangaType>;
};

export type DeleteChapterMetaInput = {
    chapterId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    key: Scalars['String']['input'];
};

export type DeleteChapterMetaPayload = {
    __typename?: 'DeleteChapterMetaPayload';
    chapter: ChapterType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta?: Maybe<ChapterMetaType>;
};

export type DeleteChapterMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<DeleteChapterMetasItemInput>;
};

export type DeleteChapterMetasItemInput = {
    chapterIds: Array<Scalars['Int']['input']>;
    keys?: InputMaybe<Array<Scalars['String']['input']>>;
    prefixes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeleteChapterMetasPayload = {
    __typename?: 'DeleteChapterMetasPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<ChapterMetaType>;
};

export type DeleteDownloadedChapterInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
};

export type DeleteDownloadedChapterPayload = {
    __typename?: 'DeleteDownloadedChapterPayload';
    chapters: ChapterType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteDownloadedChaptersInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
};

export type DeleteDownloadedChaptersPayload = {
    __typename?: 'DeleteDownloadedChaptersPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type DeleteGlobalMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    key: Scalars['String']['input'];
};

export type DeleteGlobalMetaPayload = {
    __typename?: 'DeleteGlobalMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta?: Maybe<GlobalMetaType>;
};

export type DeleteGlobalMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    keys?: InputMaybe<Array<Scalars['String']['input']>>;
    prefixes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeleteGlobalMetasPayload = {
    __typename?: 'DeleteGlobalMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<GlobalMetaType>;
};

export type DeleteMangaMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    key: Scalars['String']['input'];
    mangaId: Scalars['Int']['input'];
};

export type DeleteMangaMetaPayload = {
    __typename?: 'DeleteMangaMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    manga: MangaType;
    meta?: Maybe<MangaMetaType>;
};

export type DeleteMangaMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<DeleteMangaMetasItemInput>;
};

export type DeleteMangaMetasItemInput = {
    keys?: InputMaybe<Array<Scalars['String']['input']>>;
    mangaIds: Array<Scalars['Int']['input']>;
    prefixes?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DeleteMangaMetasPayload = {
    __typename?: 'DeleteMangaMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    mangas: Array<MangaType>;
    metas: Array<MangaMetaType>;
};

export type DeleteSourceMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    key: Scalars['String']['input'];
    sourceId: Scalars['LongString']['input'];
};

export type DeleteSourceMetaPayload = {
    __typename?: 'DeleteSourceMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta?: Maybe<SourceMetaType>;
    source?: Maybe<SourceType>;
};

export type DeleteSourceMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<DeleteSourceMetasItemInput>;
};

export type DeleteSourceMetasItemInput = {
    keys?: InputMaybe<Array<Scalars['String']['input']>>;
    prefixes?: InputMaybe<Array<Scalars['String']['input']>>;
    sourceIds: Array<Scalars['LongString']['input']>;
};

export type DeleteSourceMetasPayload = {
    __typename?: 'DeleteSourceMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<SourceMetaType>;
    sources: Array<SourceType>;
};

export type DequeueChapterDownloadInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
};

export type DequeueChapterDownloadPayload = {
    __typename?: 'DequeueChapterDownloadPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type DequeueChapterDownloadsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
};

export type DequeueChapterDownloadsPayload = {
    __typename?: 'DequeueChapterDownloadsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type DoubleFilterInput = {
    distinctFrom?: InputMaybe<Scalars['Float']['input']>;
    distinctFromAll?: InputMaybe<Array<Scalars['Float']['input']>>;
    distinctFromAny?: InputMaybe<Array<Scalars['Float']['input']>>;
    equalTo?: InputMaybe<Scalars['Float']['input']>;
    greaterThan?: InputMaybe<Scalars['Float']['input']>;
    greaterThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
    in?: InputMaybe<Array<Scalars['Float']['input']>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<Scalars['Float']['input']>;
    lessThanOrEqualTo?: InputMaybe<Scalars['Float']['input']>;
    notDistinctFrom?: InputMaybe<Scalars['Float']['input']>;
    notEqualTo?: InputMaybe<Scalars['Float']['input']>;
    notEqualToAll?: InputMaybe<Array<Scalars['Float']['input']>>;
    notEqualToAny?: InputMaybe<Array<Scalars['Float']['input']>>;
    notIn?: InputMaybe<Array<Scalars['Float']['input']>>;
};

export type DownloadChangedInput = {
    maxUpdates?: InputMaybe<Scalars['Int']['input']>;
};

export enum DownloadState {
    Downloading = 'DOWNLOADING',
    Error = 'ERROR',
    Finished = 'FINISHED',
    Queued = 'QUEUED',
}

export type DownloadStatus = {
    __typename?: 'DownloadStatus';
    queue: Array<DownloadType>;
    state: DownloaderState;
};

export type DownloadType = {
    __typename?: 'DownloadType';
    chapter: ChapterType;
    manga: MangaType;
    position: Scalars['Int']['output'];
    progress: Scalars['Float']['output'];
    state: DownloadState;
    tries: Scalars['Int']['output'];
};

export type DownloadUpdate = {
    __typename?: 'DownloadUpdate';
    download: DownloadType;
    type: DownloadUpdateType;
};

export enum DownloadUpdateType {
    Dequeued = 'DEQUEUED',
    Error = 'ERROR',
    Finished = 'FINISHED',
    Paused = 'PAUSED',
    Position = 'POSITION',
    Progress = 'PROGRESS',
    Queued = 'QUEUED',
    Stopped = 'STOPPED',
}

export type DownloadUpdates = {
    __typename?: 'DownloadUpdates';
    initial?: Maybe<Array<DownloadType>>;
    omittedUpdates: Scalars['Boolean']['output'];
    state: DownloaderState;
    /**
     * 相对上一条事件的队列差量。WebUI 的下载页按它增量维护缓存 ——
     * 只给 [`Self::initial`]（整条快照）的话，页面上队列不会随下载推进更新。
     */
    updates: Array<DownloadUpdate>;
};

export enum DownloaderState {
    Started = 'STARTED',
    Stopped = 'STOPPED',
}

export type EditTextPreference = {
    __typename?: 'EditTextPreference';
    currentValue?: Maybe<Scalars['String']['output']>;
    default?: Maybe<Scalars['String']['output']>;
    dialogMessage?: Maybe<Scalars['String']['output']>;
    dialogTitle?: Maybe<Scalars['String']['output']>;
    enabled: Scalars['Boolean']['output'];
    key?: Maybe<Scalars['String']['output']>;
    summary?: Maybe<Scalars['String']['output']>;
    text?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    visible: Scalars['Boolean']['output'];
};

export type EnqueueChapterDownloadInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
};

export type EnqueueChapterDownloadPayload = {
    __typename?: 'EnqueueChapterDownloadPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type EnqueueChapterDownloadsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
};

export type EnqueueChapterDownloadsPayload = {
    __typename?: 'EnqueueChapterDownloadsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type ExtensionConditionInput = {
    contentWarning?: InputMaybe<ContentWarning>;
    hasUpdate?: InputMaybe<Scalars['Boolean']['input']>;
    isInstalled?: InputMaybe<Scalars['Boolean']['input']>;
    isObsolete?: InputMaybe<Scalars['Boolean']['input']>;
    lang?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    pkgName?: InputMaybe<Scalars['String']['input']>;
    storeIndexUrl?: InputMaybe<Scalars['String']['input']>;
};

export type ExtensionEdge = {
    __typename?: 'ExtensionEdge';
    cursor: Scalars['Cursor']['output'];
    node: ExtensionType;
};

export type ExtensionFilterInput = {
    and?: InputMaybe<Array<ExtensionFilterInput>>;
    contentWarning?: InputMaybe<ContentWarningFilterInput>;
    lang?: InputMaybe<StringFilterInput>;
    name?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<ExtensionFilterInput>;
    or?: InputMaybe<Array<ExtensionFilterInput>>;
    pkgName?: InputMaybe<StringFilterInput>;
};

export type ExtensionNodeList = {
    __typename?: 'ExtensionNodeList';
    edges: Array<ExtensionEdge>;
    nodes: Array<ExtensionType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum ExtensionOrderBy {
    ApkName = 'APK_NAME',
    Name = 'NAME',
    PkgName = 'PKG_NAME',
}

export type ExtensionOrderInput = {
    by: ExtensionOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type ExtensionStoreConditionInput = {
    id?: InputMaybe<Scalars['Int']['input']>;
    indexUrl?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type ExtensionStoreEdge = {
    __typename?: 'ExtensionStoreEdge';
    cursor: Scalars['Cursor']['output'];
    node: ExtensionStoreType;
};

export type ExtensionStoreFilterInput = {
    and?: InputMaybe<Array<ExtensionStoreFilterInput>>;
    indexUrl?: InputMaybe<StringFilterInput>;
    name?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<ExtensionStoreFilterInput>;
    or?: InputMaybe<Array<ExtensionStoreFilterInput>>;
};

export type ExtensionStoreNodeList = {
    __typename?: 'ExtensionStoreNodeList';
    edges: Array<ExtensionStoreEdge>;
    nodes: Array<ExtensionStoreType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum ExtensionStoreOrderBy {
    IndexUrl = 'INDEX_URL',
    Name = 'NAME',
}

export type ExtensionStoreOrderInput = {
    by: ExtensionStoreOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type ExtensionStoreType = {
    __typename?: 'ExtensionStoreType';
    badgeLabel: Scalars['String']['output'];
    contactDiscord?: Maybe<Scalars['String']['output']>;
    contactWebsite: Scalars['String']['output'];
    extensionListUrl?: Maybe<Scalars['String']['output']>;
    extensions: ExtensionNodeList;
    indexUrl: Scalars['String']['output'];
    isLegacy: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    signingKey: Scalars['String']['output'];
};

export type ExtensionType = {
    __typename?: 'ExtensionType';
    apkName?: Maybe<Scalars['String']['output']>;
    apkUrl?: Maybe<Scalars['String']['output']>;
    contentWarning: ContentWarning;
    extensionLib?: Maybe<Scalars['String']['output']>;
    extensionStore?: Maybe<ExtensionStoreType>;
    hasUpdate: Scalars['Boolean']['output'];
    iconUrl: Scalars['String']['output'];
    isInstalled: Scalars['Boolean']['output'];
    isNsfw: Scalars['Boolean']['output'];
    isObsolete: Scalars['Boolean']['output'];
    jarUrl?: Maybe<Scalars['String']['output']>;
    lang: Scalars['String']['output'];
    name: Scalars['String']['output'];
    pkgName: Scalars['String']['output'];
    repo?: Maybe<Scalars['String']['output']>;
    source: SourceNodeList;
    storeIndexUrl?: Maybe<Scalars['String']['output']>;
    versionCode: Scalars['Int']['output'];
    versionCodeLong: Scalars['LongString']['output'];
    versionName: Scalars['String']['output'];
};

export type FetchChapterPagesInput = {
    chapterId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    format?: InputMaybe<Scalars['String']['input']>;
};

export type FetchChapterPagesPayload = {
    __typename?: 'FetchChapterPagesPayload';
    chapter: ChapterType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    pages: Array<Scalars['String']['output']>;
    syncConflict?: Maybe<SyncConflictInfoType>;
};

export type FetchChaptersInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    mangaId: Scalars['Int']['input'];
};

export type FetchChaptersPayload = {
    __typename?: 'FetchChaptersPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type FetchExtensionsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type FetchExtensionsPayload = {
    __typename?: 'FetchExtensionsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extensionStores: Array<ExtensionStoreType>;
    extensions: Array<ExtensionType>;
};

export type FetchMangaAndChaptersInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    fetchChapters: Scalars['Boolean']['input'];
    fetchManga: Scalars['Boolean']['input'];
    id: Scalars['Int']['input'];
};

export type FetchMangaAndChaptersPayload = {
    __typename?: 'FetchMangaAndChaptersPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    manga: MangaType;
};

export type FetchMangaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
};

export type FetchMangaPayload = {
    __typename?: 'FetchMangaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    manga: MangaType;
};

export type FetchSourceMangaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    filters?: InputMaybe<Array<FilterChangeInput>>;
    page: Scalars['Int']['input'];
    query?: InputMaybe<Scalars['String']['input']>;
    source: Scalars['LongString']['input'];
    type: FetchSourceMangaType;
};

export type FetchSourceMangaPayload = {
    __typename?: 'FetchSourceMangaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    hasNextPage: Scalars['Boolean']['output'];
    mangas: Array<MangaType>;
};

export enum FetchSourceMangaType {
    Latest = 'LATEST',
    Popular = 'POPULAR',
    Search = 'SEARCH',
}

export type FetchTrackInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    recordId: Scalars['Int']['input'];
};

export type FetchTrackPayload = {
    __typename?: 'FetchTrackPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecord: TrackRecordType;
};

/** Mirrors `union Filter = ...`. */
export type Filter =
    | CheckBoxFilter
    | GroupFilter
    | HeaderFilter
    | SelectFilter
    | SeparatorFilter
    | SortFilter
    | TextFilter
    | TriStateFilter;

export type FilterChangeInput = {
    checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
    position?: InputMaybe<Scalars['Int']['input']>;
    sortState?: InputMaybe<SortSelectionInput>;
    state?: InputMaybe<Scalars['Int']['input']>;
    textState?: InputMaybe<Scalars['String']['input']>;
    triState?: InputMaybe<TriState>;
};

export type GlobalMetaNodeList = {
    __typename?: 'GlobalMetaNodeList';
    edges: Array<MetaEdge>;
    nodes: Array<GlobalMetaType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

/** Mirrors `GlobalMetaType.kt`. */
export type GlobalMetaType = {
    __typename?: 'GlobalMetaType';
    key: Scalars['String']['output'];
    value: Scalars['String']['output'];
};

export type GlobalMetaTypeInput = {
    key: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

export type GroupFilter = {
    __typename?: 'GroupFilter';
    filters: Array<Filter>;
    name: Scalars['String']['output'];
};

export type HeaderFilter = {
    __typename?: 'HeaderFilter';
    name: Scalars['String']['output'];
};

export enum IncludeOrExclude {
    Exclude = 'EXCLUDE',
    Include = 'INCLUDE',
    Unset = 'UNSET',
}

export type InstallExternalExtensionInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    extensionFile: Scalars['Upload']['input'];
};

export type InstallExternalExtensionPayload = {
    __typename?: 'InstallExternalExtensionPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extension: ExtensionType;
};

export type IntFilterInput = {
    distinctFrom?: InputMaybe<Scalars['Int']['input']>;
    distinctFromAll?: InputMaybe<Array<Scalars['Int']['input']>>;
    distinctFromAny?: InputMaybe<Array<Scalars['Int']['input']>>;
    equalTo?: InputMaybe<Scalars['Int']['input']>;
    greaterThan?: InputMaybe<Scalars['Int']['input']>;
    greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
    in?: InputMaybe<Array<Scalars['Int']['input']>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<Scalars['Int']['input']>;
    lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
    notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
    notEqualTo?: InputMaybe<Scalars['Int']['input']>;
    notEqualToAll?: InputMaybe<Array<Scalars['Int']['input']>>;
    notEqualToAny?: InputMaybe<Array<Scalars['Int']['input']>>;
    notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type JvmInfo = {
    __typename?: 'JvmInfo';
    javaVersion: Scalars['String']['output'];
    vmName: Scalars['String']['output'];
    vmVendor: Scalars['String']['output'];
    vmVersion: Scalars['String']['output'];
};

export type KoSyncConnectPayload = {
    __typename?: 'KoSyncConnectPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    message?: Maybe<Scalars['String']['output']>;
    status: KoSyncStatusPayload;
};

/** Mirrors `KoSyncStatusPayload`. */
export type KoSyncStatusPayload = {
    __typename?: 'KoSyncStatusPayload';
    isLoggedIn: Scalars['Boolean']['output'];
    serverAddress?: Maybe<Scalars['String']['output']>;
    username?: Maybe<Scalars['String']['output']>;
};

export enum KoreaderSyncChecksumMethod {
    Binary = 'BINARY',
    Filename = 'FILENAME',
}

export enum KoreaderSyncConflictStrategy {
    Disabled = 'DISABLED',
    KeepLocal = 'KEEP_LOCAL',
    KeepRemote = 'KEEP_REMOTE',
    Prompt = 'PROMPT',
}

export enum KoreaderSyncLegacyStrategy {
    Disabled = 'DISABLED',
    Prompt = 'PROMPT',
    Receive = 'RECEIVE',
    Send = 'SEND',
    Silent = 'SILENT',
}

export type LastUpdateTimestampPayload = {
    __typename?: 'LastUpdateTimestampPayload';
    timestamp: Scalars['LongString']['output'];
};

export type LibraryUpdateStatus = {
    __typename?: 'LibraryUpdateStatus';
    categoryUpdates: Array<CategoryUpdateType>;
    jobsInfo: UpdaterJobsInfoType;
    mangaUpdates: Array<MangaUpdateType>;
};

export type LibraryUpdateStatusChangedInput = {
    maxUpdates?: InputMaybe<Scalars['Int']['input']>;
};

export type ListPreference = {
    __typename?: 'ListPreference';
    currentValue?: Maybe<Scalars['String']['output']>;
    default?: Maybe<Scalars['String']['output']>;
    enabled: Scalars['Boolean']['output'];
    entries: Array<Scalars['String']['output']>;
    entryValues: Array<Scalars['String']['output']>;
    key?: Maybe<Scalars['String']['output']>;
    summary?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    visible: Scalars['Boolean']['output'];
};

export type LoginInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    password: Scalars['String']['input'];
    username: Scalars['String']['input'];
};

export type LoginPayload = {
    __typename?: 'LoginPayload';
    accessToken: Scalars['String']['output'];
    clientMutationId?: Maybe<Scalars['String']['output']>;
    refreshToken: Scalars['String']['output'];
};

export type LoginTrackerCredentialsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    password: Scalars['String']['input'];
    trackerId: Scalars['Int']['input'];
    username: Scalars['String']['input'];
};

export type LoginTrackerCredentialsPayload = {
    __typename?: 'LoginTrackerCredentialsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    isLoggedIn: Scalars['Boolean']['output'];
    tracker: TrackerType;
};

export type LoginTrackerOAuthInput = {
    callbackUrl: Scalars['String']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    trackerId: Scalars['Int']['input'];
};

export type LoginTrackerOAuthPayload = {
    __typename?: 'LoginTrackerOAuthPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    isLoggedIn: Scalars['Boolean']['output'];
    tracker: TrackerType;
};

export type LogoutKoSyncAccountInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type LogoutKoSyncAccountPayload = {
    __typename?: 'LogoutKoSyncAccountPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    status: KoSyncStatusPayload;
};

export type LogoutTrackerInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    trackerId: Scalars['Int']['input'];
};

export type LogoutTrackerPayload = {
    __typename?: 'LogoutTrackerPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    isLoggedIn: Scalars['Boolean']['output'];
    tracker: TrackerType;
};

export type LongFilterInput = {
    distinctFrom?: InputMaybe<Scalars['LongString']['input']>;
    distinctFromAll?: InputMaybe<Array<Scalars['LongString']['input']>>;
    distinctFromAny?: InputMaybe<Array<Scalars['LongString']['input']>>;
    equalTo?: InputMaybe<Scalars['LongString']['input']>;
    greaterThan?: InputMaybe<Scalars['LongString']['input']>;
    greaterThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
    in?: InputMaybe<Array<Scalars['LongString']['input']>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<Scalars['LongString']['input']>;
    lessThanOrEqualTo?: InputMaybe<Scalars['LongString']['input']>;
    notDistinctFrom?: InputMaybe<Scalars['LongString']['input']>;
    notEqualTo?: InputMaybe<Scalars['LongString']['input']>;
    notEqualToAll?: InputMaybe<Array<Scalars['LongString']['input']>>;
    notEqualToAny?: InputMaybe<Array<Scalars['LongString']['input']>>;
    notIn?: InputMaybe<Array<Scalars['LongString']['input']>>;
};

/** Mirrors `MangaCondition` from `MangaQuery.kt` (core filters). */
export type MangaConditionInput = {
    artist?: InputMaybe<Scalars['String']['input']>;
    author?: InputMaybe<Scalars['String']['input']>;
    /**
     * Restrict to manga belonging to the given categories
     * (WebUI library screen sends `categoryIds`).
     */
    categoryIds?: InputMaybe<Array<Scalars['Int']['input']>>;
    description?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['Int']['input']>;
    inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
    initialized?: InputMaybe<Scalars['Boolean']['input']>;
    /**
     * LongString so WebUI source ids (strings, e.g. "0") match the schema;
     * plain i64 would surface as `Int` and reject string input.
     */
    sourceId?: InputMaybe<Scalars['LongString']['input']>;
    status?: InputMaybe<MangaStatus>;
    title?: InputMaybe<Scalars['String']['input']>;
    url?: InputMaybe<Scalars['String']['input']>;
};

export type MangaEdge = {
    __typename?: 'MangaEdge';
    cursor: Scalars['Cursor']['output'];
    node: MangaType;
};

export type MangaFilterInput = {
    and?: InputMaybe<Array<MangaFilterInput>>;
    artist?: InputMaybe<StringFilterInput>;
    author?: InputMaybe<StringFilterInput>;
    categoryId?: InputMaybe<IntFilterInput>;
    chaptersLastFetchedAt?: InputMaybe<LongFilterInput>;
    description?: InputMaybe<StringFilterInput>;
    genre?: InputMaybe<StringFilterInput>;
    id?: InputMaybe<IntFilterInput>;
    inLibrary?: InputMaybe<BooleanFilterInput>;
    inLibraryAt?: InputMaybe<LongFilterInput>;
    initialized?: InputMaybe<BooleanFilterInput>;
    lastFetchedAt?: InputMaybe<LongFilterInput>;
    not?: InputMaybe<MangaFilterInput>;
    or?: InputMaybe<Array<MangaFilterInput>>;
    realUrl?: InputMaybe<StringFilterInput>;
    sourceId?: InputMaybe<LongFilterInput>;
    status?: InputMaybe<MangaStatusFilterInput>;
    thumbnailUrl?: InputMaybe<StringFilterInput>;
    title?: InputMaybe<StringFilterInput>;
    url?: InputMaybe<StringFilterInput>;
};

export enum MangaJobStatus {
    Complete = 'COMPLETE',
    Failed = 'FAILED',
    Pending = 'PENDING',
    Running = 'RUNNING',
    Skipped = 'SKIPPED',
}

export type MangaMetaType = {
    __typename?: 'MangaMetaType';
    key: Scalars['String']['output'];
    manga: MangaType;
    mangaId: Scalars['Int']['output'];
    value: Scalars['String']['output'];
};

export type MangaMetaTypeInput = {
    key: Scalars['String']['input'];
    mangaId: Scalars['Int']['input'];
    value: Scalars['String']['input'];
};

export type MangaNodeList = {
    __typename?: 'MangaNodeList';
    edges: Array<MangaEdge>;
    nodes: Array<MangaType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

/** Mirrors `MangaOrderBy` from `MangaQuery.kt`. */
export enum MangaOrderBy {
    Id = 'ID',
    InLibraryAt = 'IN_LIBRARY_AT',
    LastFetchedAt = 'LAST_FETCHED_AT',
    Title = 'TITLE',
}

export type MangaOrderInput = {
    by: MangaOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export enum MangaStatus {
    Cancelled = 'CANCELLED',
    Completed = 'COMPLETED',
    Licensed = 'LICENSED',
    Ongoing = 'ONGOING',
    OnHiatus = 'ON_HIATUS',
    PublishingFinished = 'PUBLISHING_FINISHED',
    Unknown = 'UNKNOWN',
}

export type MangaStatusFilterInput = {
    distinctFrom?: InputMaybe<MangaStatus>;
    distinctFromAll?: InputMaybe<Array<MangaStatus>>;
    distinctFromAny?: InputMaybe<Array<MangaStatus>>;
    equalTo?: InputMaybe<MangaStatus>;
    greaterThan?: InputMaybe<MangaStatus>;
    greaterThanOrEqualTo?: InputMaybe<MangaStatus>;
    in?: InputMaybe<Array<MangaStatus>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<MangaStatus>;
    lessThanOrEqualTo?: InputMaybe<MangaStatus>;
    notDistinctFrom?: InputMaybe<MangaStatus>;
    notEqualTo?: InputMaybe<MangaStatus>;
    notEqualToAll?: InputMaybe<Array<MangaStatus>>;
    notEqualToAny?: InputMaybe<Array<MangaStatus>>;
    notIn?: InputMaybe<Array<MangaStatus>>;
};

export type MangaType = {
    __typename?: 'MangaType';
    age?: Maybe<Scalars['LongString']['output']>;
    altTitles: Array<Scalars['String']['output']>;
    artist?: Maybe<Scalars['String']['output']>;
    author?: Maybe<Scalars['String']['output']>;
    bookmarkCount: Scalars['Int']['output'];
    categories: CategoryNodeList;
    chapters: ChapterNodeList;
    chaptersAge?: Maybe<Scalars['LongString']['output']>;
    chaptersLastFetchedAt?: Maybe<Scalars['LongString']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    downloadCount: Scalars['Int']['output'];
    /**
     * 对齐上游 `FirstUnreadChapterForMangaDataLoader`：未读章节中 sourceOrder 最小者
     * （「继续阅读」应指向最靠前的未读章节，旧实现按 sourceOrder 倒序取首个未读）。
     */
    firstUnreadChapter?: Maybe<ChapterType>;
    genre: Array<Scalars['String']['output']>;
    hasDuplicateChapters: Scalars['Boolean']['output'];
    /**
     * 对齐上游 `HighestNumberedChapterForMangaDataLoader`：仅在 chapter_number > 0
     * 的章节中取最大编号（编号 0 / 负数表示未知编号，不应参与）。
     */
    highestNumberedChapter?: Maybe<ChapterType>;
    id: Scalars['Int']['output'];
    inLibrary: Scalars['Boolean']['output'];
    inLibraryAt: Scalars['LongString']['output'];
    initialized: Scalars['Boolean']['output'];
    lastFetchedAt?: Maybe<Scalars['LongString']['output']>;
    /**
     * 对齐上游 `LastReadChapterForMangaDataLoader`：按 lastReadAt 降序取首条
     * （**不过滤是否已读**，与 latestReadChapter 的语义正好互换）。
     * 书架「按最后一次阅读」排序依赖该字段，旧实现取「已读中 sourceOrder 最大」，
     * 导致阅读后排序键不更新、顺序不刷新。
     */
    lastReadChapter?: Maybe<ChapterType>;
    /**
     * 对齐上游 `LatestFetchedChapterForMangaDataLoader`：fetchedAt 降序，
     * 同一时间戳时以 sourceOrder 降序作为次级排序。
     */
    latestFetchedChapter?: Maybe<ChapterType>;
    /** 对齐上游 `LatestReadChapterForMangaDataLoader`：已读章节中 sourceOrder 最大者。 */
    latestReadChapter?: Maybe<ChapterType>;
    /**
     * 对齐上游 `LatestUploadedChapterForMangaDataLoader`：date_upload 降序，
     * 同一时间戳时以 sourceOrder 降序作为次级排序。
     */
    latestUploadedChapter?: Maybe<ChapterType>;
    meta: Array<MangaMetaType>;
    realUrl?: Maybe<Scalars['String']['output']>;
    source?: Maybe<SourceType>;
    sourceId: Scalars['LongString']['output'];
    status: MangaStatus;
    thumbnailUrl?: Maybe<Scalars['String']['output']>;
    /**
     * 上游把这一项声明成可空的（`thumbnailUrlLastFetched: LongString`）；0 表示
     * 封面从未抓取过，这里就返回 null，而不是把哨兵值 0 当时间戳发出去。
     */
    thumbnailUrlLastFetched?: Maybe<Scalars['LongString']['output']>;
    title: Scalars['String']['output'];
    /**
     * 对齐上游 `TrackRecordsForMangaIdDataLoader`：按 manga_id 查询绑定记录。
     * 旧实现恒返回空列表，导致 WebUI 书架的「按追踪器筛选」永远筛不出结果。
     */
    trackRecords: TrackRecordNodeList;
    unreadCount: Scalars['Int']['output'];
    updateStrategy: UpdateStrategy;
    url: Scalars['String']['output'];
};

export type MangaUpdateType = {
    __typename?: 'MangaUpdateType';
    manga: MangaType;
    status: MangaJobStatus;
};

/** Mirrors `MetaCondition` from `MetaQuery.kt`. */
export type MetaConditionInput = {
    key?: InputMaybe<Scalars['String']['input']>;
    value?: InputMaybe<Scalars['String']['input']>;
};

/** TrackRecordNodeList — full implementation lives in `track.rs`. */
export type MetaEdge = {
    __typename?: 'MetaEdge';
    cursor: Scalars['Cursor']['output'];
    node: GlobalMetaType;
};

export type MetaFilterInput = {
    and?: InputMaybe<Array<MetaFilterInput>>;
    key?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<MetaFilterInput>;
    or?: InputMaybe<Array<MetaFilterInput>>;
    value?: InputMaybe<StringFilterInput>;
};

export type MetaInput = {
    key: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

export enum MetaOrderBy {
    Key = 'KEY',
    Value = 'VALUE',
}

export type MetaOrderInput = {
    by: MetaOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type MultiSelectListPreference = {
    __typename?: 'MultiSelectListPreference';
    currentValue?: Maybe<Array<Scalars['String']['output']>>;
    default?: Maybe<Array<Scalars['String']['output']>>;
    dialogMessage?: Maybe<Scalars['String']['output']>;
    dialogTitle?: Maybe<Scalars['String']['output']>;
    enabled: Scalars['Boolean']['output'];
    entries: Array<Scalars['String']['output']>;
    entryValues: Array<Scalars['String']['output']>;
    key?: Maybe<Scalars['String']['output']>;
    summary?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    visible: Scalars['Boolean']['output'];
};

export type Mutation = {
    __typename?: 'Mutation';
    /** Mirrors `addExtensionStore` — inserts the store row. */
    addExtensionStore: AddExtensionStorePayload;
    /** Mirrors `bindTrack`. */
    bindTrack: BindTrackPayload;
    /**
     * Mirrors `bindTrackRecord` — 返回并进后的那一行（目标漫画原本已有记录时
     * 是目标行，不是入参的那一行）。
     */
    bindTrackRecord: BindTrackRecordPayload;
    clearCachedImages: ClearCachedImagesPayload;
    /**
     * 入参可省：上游把它声明成可选（`input: ClearCookiesAndCacheInput`，
     * Kotlin 侧默认 `= ClearCookiesAndCacheInput()`），WebUI 的
     * `WEBVIEW_CLEAR_CACHE_COOKIES` 就不带参数。声明成必填会让那条 mutation
     * 校验不过。
     */
    clearCookiesAndCache: ClearCookiesAndCachePayload;
    clearDownloader: ClearDownloaderPayload;
    /** Mirrors `connectKoSyncAccount`. */
    connectKoSyncAccount: KoSyncConnectPayload;
    createBackup: CreateBackupPayload;
    createCategory: CreateCategoryPayload;
    deleteCategory: DeleteCategoryPayload;
    deleteCategoryMeta: DeleteCategoryMetaPayload;
    deleteCategoryMetas: DeleteCategoryMetasPayload;
    deleteChapterMeta: DeleteChapterMetaPayload;
    deleteChapterMetas: DeleteChapterMetasPayload;
    /** Mirrors `deleteDownloadedChapter` — clears the downloaded flag. */
    deleteDownloadedChapter: DeleteDownloadedChapterPayload;
    deleteDownloadedChapters: DeleteDownloadedChaptersPayload;
    deleteGlobalMeta: DeleteGlobalMetaPayload;
    deleteGlobalMetas: DeleteGlobalMetasPayload;
    deleteMangaMeta: DeleteMangaMetaPayload;
    deleteMangaMetas: DeleteMangaMetasPayload;
    deleteSourceMeta: DeleteSourceMetaPayload;
    deleteSourceMetas: DeleteSourceMetasPayload;
    dequeueChapterDownload: DequeueChapterDownloadPayload;
    dequeueChapterDownloads: DequeueChapterDownloadsPayload;
    enqueueChapterDownload: EnqueueChapterDownloadPayload;
    enqueueChapterDownloads: EnqueueChapterDownloadsPayload;
    fetchChapterPages: FetchChapterPagesPayload;
    fetchChapters: FetchChaptersPayload;
    /**
     * Mirrors `fetchExtensions` — refreshes the repo indexes, syncs the
     * sandbox's loaded sources, then lists extensions & stores from DB.
     */
    fetchExtensions: FetchExtensionsPayload;
    fetchManga: FetchMangaPayload;
    fetchMangaAndChapters: FetchMangaAndChaptersPayload;
    fetchSourceManga: FetchSourceMangaPayload;
    /** Mirrors `fetchTrack` — 先拉站点上的最新状态，再回读本地行。 */
    fetchTrack: FetchTrackPayload;
    installExternalExtension: InstallExternalExtensionPayload;
    /**
     * Mirrors `login` — UI_LOGIN 模式下 WebUI 的登录入口。
     *
     * 用户名密码比对成功即签发一对 JWT；失败返回与其它未认证请求同样的
     * `UnauthorizedException` 文案（WebUI 靠它识别认证失败）。
     */
    login: LoginPayload;
    /** Mirrors `loginTrackerCredentials`. */
    loginTrackerCredentials: LoginTrackerCredentialsPayload;
    /** Mirrors `loginTrackerOAuth` — `callbackUrl` 即浏览器回调地址，用户名密码不参与。 */
    loginTrackerOAuth: LoginTrackerOAuthPayload;
    /** Mirrors `logoutKoSyncAccount`. */
    logoutKoSyncAccount: LogoutKoSyncAccountPayload;
    /** Mirrors `logoutTracker` — 未登录时报错，不做静默成功。 */
    logoutTracker: LogoutTrackerPayload;
    /** Mirrors `pullKoSyncProgress`. */
    pullKoSyncProgress: PullKoSyncProgressPayload;
    /** Mirrors `pushKoSyncProgress`. */
    pushKoSyncProgress: PushKoSyncProgressPayload;
    /** 「存储管理 → 重建下载索引」：用磁盘重新对账下载，返回扫到的章节数。 */
    rebuildDownloadIndex: RebuildDownloadIndexPayload;
    /** Mirrors `refreshToken` — 用 refresh token 换新的 access token。 */
    refreshToken: RefreshTokenPayload;
    /**
     * Mirrors Mihon `BaseTracker.refreshUser()` —— 重新拉站点上的用户级设置（评分制）
     * 并落库，`tracker.scores` 随之更新。上游 Suwayomi 没有对应 mutation。
     */
    refreshTrackerUser: RefreshTrackerUserPayload;
    removeExtensionStore: RemoveExtensionStorePayload;
    reorderChapterDownload: ReorderChapterDownloadPayload;
    reorderChapterDownloads: ReorderChapterDownloadsPayload;
    resetSettings: ResetSettingsPayload;
    restoreBackup: RestoreBackupPayload;
    setCategoryMeta: SetCategoryMetaPayload;
    setCategoryMetas: SetCategoryMetasPayload;
    setChapterMeta: SetChapterMetaPayload;
    setChapterMetas: SetChapterMetasPayload;
    setGlobalMeta: SetGlobalMetaPayload;
    setGlobalMetas: SetGlobalMetasPayload;
    setMangaMeta: SetMangaMetaPayload;
    setMangaMetas: SetMangaMetasPayload;
    setSettings: SetSettingsPayload;
    setSourceMeta: SetSourceMetaPayload;
    setSourceMetas: SetSourceMetasPayload;
    startDownloader: StartDownloaderPayload;
    startSync: StartSyncPayload;
    stopDownloader: StopDownloaderPayload;
    /** Mirrors `trackProgress` — 先把当前阅读进度推给站点，再返回该漫画的全部记录。 */
    trackProgress: TrackProgressPayload;
    /**
     * Mirrors `unbindTrack` — 本地行总是删；`deleteRemoteTrack` 只在站点支持删除
     * 时才会连带删掉站点上的记录。删除后回读，所以 `trackRecord` 恒为 null。
     */
    unbindTrack: UnbindTrackPayload;
    updateCategories: UpdateCategoriesPayload;
    updateCategory: UpdateCategoryPayload;
    updateCategoryManga: UpdateCategoryMangaPayload;
    updateCategoryOrder: UpdateCategoryOrderPayload;
    updateChapter: UpdateChapterPayload;
    updateChapters: UpdateChaptersPayload;
    updateExtension: UpdateExtensionPayload;
    updateExtensions: UpdateExtensionsPayload;
    updateLibrary: UpdateLibraryPayload;
    updateLibraryManga: UpdateLibraryMangaPayload;
    updateManga: UpdateMangaPayload;
    updateMangaCategories: UpdateMangaCategoriesPayload;
    updateMangas: UpdateMangasPayload;
    updateMangasCategories: UpdateMangasCategoriesPayload;
    updateSourcePreference: UpdateSourcePreferencePayload;
    updateStop: UpdateStopPayload;
    /** Mirrors `updateTrack` — 由 `domain::tracker` 负责状态/进度的连带推导，再推给站点。 */
    updateTrack: UpdateTrackPayload;
    /**
     * 改站点的 OAuth 应用凭据（设置页的齿轮）。写完立刻生效并落盘 —— 下一次登录
     * 用的就是新 `clientId`。填空白等于回到内置默认值。
     */
    updateTrackerOAuthApp: UpdateTrackerOAuthAppPayload;
};

export type MutationAddExtensionStoreArgs = {
    input: AddExtensionStoreInput;
};

export type MutationBindTrackArgs = {
    input: BindTrackInput;
};

export type MutationBindTrackRecordArgs = {
    input: BindTrackRecordInput;
};

export type MutationClearCachedImagesArgs = {
    input: ClearCachedImagesInput;
};

export type MutationClearCookiesAndCacheArgs = {
    input?: InputMaybe<ClearCookiesAndCacheInput>;
};

export type MutationClearDownloaderArgs = {
    input: ClearDownloaderInput;
};

export type MutationConnectKoSyncAccountArgs = {
    input: ConnectKoSyncAccountInput;
};

export type MutationCreateBackupArgs = {
    input: CreateBackupInput;
};

export type MutationCreateCategoryArgs = {
    input: CreateCategoryInput;
};

export type MutationDeleteCategoryArgs = {
    input: DeleteCategoryInput;
};

export type MutationDeleteCategoryMetaArgs = {
    input: DeleteCategoryMetaInput;
};

export type MutationDeleteCategoryMetasArgs = {
    input: DeleteCategoryMetasInput;
};

export type MutationDeleteChapterMetaArgs = {
    input: DeleteChapterMetaInput;
};

export type MutationDeleteChapterMetasArgs = {
    input: DeleteChapterMetasInput;
};

export type MutationDeleteDownloadedChapterArgs = {
    input: DeleteDownloadedChapterInput;
};

export type MutationDeleteDownloadedChaptersArgs = {
    input: DeleteDownloadedChaptersInput;
};

export type MutationDeleteGlobalMetaArgs = {
    input: DeleteGlobalMetaInput;
};

export type MutationDeleteGlobalMetasArgs = {
    input: DeleteGlobalMetasInput;
};

export type MutationDeleteMangaMetaArgs = {
    input: DeleteMangaMetaInput;
};

export type MutationDeleteMangaMetasArgs = {
    input: DeleteMangaMetasInput;
};

export type MutationDeleteSourceMetaArgs = {
    input: DeleteSourceMetaInput;
};

export type MutationDeleteSourceMetasArgs = {
    input: DeleteSourceMetasInput;
};

export type MutationDequeueChapterDownloadArgs = {
    input: DequeueChapterDownloadInput;
};

export type MutationDequeueChapterDownloadsArgs = {
    input: DequeueChapterDownloadsInput;
};

export type MutationEnqueueChapterDownloadArgs = {
    input: EnqueueChapterDownloadInput;
};

export type MutationEnqueueChapterDownloadsArgs = {
    input: EnqueueChapterDownloadsInput;
};

export type MutationFetchChapterPagesArgs = {
    input: FetchChapterPagesInput;
};

export type MutationFetchChaptersArgs = {
    input: FetchChaptersInput;
};

export type MutationFetchExtensionsArgs = {
    input: FetchExtensionsInput;
};

export type MutationFetchMangaArgs = {
    input: FetchMangaInput;
};

export type MutationFetchMangaAndChaptersArgs = {
    input: FetchMangaAndChaptersInput;
};

export type MutationFetchSourceMangaArgs = {
    input: FetchSourceMangaInput;
};

export type MutationFetchTrackArgs = {
    input: FetchTrackInput;
};

export type MutationInstallExternalExtensionArgs = {
    input: InstallExternalExtensionInput;
};

export type MutationLoginArgs = {
    input: LoginInput;
};

export type MutationLoginTrackerCredentialsArgs = {
    input: LoginTrackerCredentialsInput;
};

export type MutationLoginTrackerOAuthArgs = {
    input: LoginTrackerOAuthInput;
};

export type MutationLogoutKoSyncAccountArgs = {
    input: LogoutKoSyncAccountInput;
};

export type MutationLogoutTrackerArgs = {
    input: LogoutTrackerInput;
};

export type MutationPullKoSyncProgressArgs = {
    input: PullKoSyncProgressInput;
};

export type MutationPushKoSyncProgressArgs = {
    input: PushKoSyncProgressInput;
};

export type MutationRebuildDownloadIndexArgs = {
    input: RebuildDownloadIndexInput;
};

export type MutationRefreshTokenArgs = {
    input: RefreshTokenInput;
};

export type MutationRefreshTrackerUserArgs = {
    input: RefreshTrackerUserInput;
};

export type MutationRemoveExtensionStoreArgs = {
    input: RemoveExtensionStoreInput;
};

export type MutationReorderChapterDownloadArgs = {
    input: ReorderChapterDownloadInput;
};

export type MutationReorderChapterDownloadsArgs = {
    input: ReorderChapterDownloadsInput;
};

export type MutationResetSettingsArgs = {
    input: ResetSettingsInput;
};

export type MutationRestoreBackupArgs = {
    input: RestoreBackupInput;
};

export type MutationSetCategoryMetaArgs = {
    input: SetCategoryMetaInput;
};

export type MutationSetCategoryMetasArgs = {
    input: SetCategoryMetasInput;
};

export type MutationSetChapterMetaArgs = {
    input: SetChapterMetaInput;
};

export type MutationSetChapterMetasArgs = {
    input: SetChapterMetasInput;
};

export type MutationSetGlobalMetaArgs = {
    input: SetGlobalMetaInput;
};

export type MutationSetGlobalMetasArgs = {
    input: SetGlobalMetasInput;
};

export type MutationSetMangaMetaArgs = {
    input: SetMangaMetaInput;
};

export type MutationSetMangaMetasArgs = {
    input: SetMangaMetasInput;
};

export type MutationSetSettingsArgs = {
    input: SetSettingsInput;
};

export type MutationSetSourceMetaArgs = {
    input: SetSourceMetaInput;
};

export type MutationSetSourceMetasArgs = {
    input: SetSourceMetasInput;
};

export type MutationStartDownloaderArgs = {
    input: StartDownloaderInput;
};

export type MutationStartSyncArgs = {
    input: StartSyncInput;
};

export type MutationStopDownloaderArgs = {
    input: StopDownloaderInput;
};

export type MutationTrackProgressArgs = {
    input: TrackProgressInput;
};

export type MutationUnbindTrackArgs = {
    input: UnbindTrackInput;
};

export type MutationUpdateCategoriesArgs = {
    input: UpdateCategoriesInput;
};

export type MutationUpdateCategoryArgs = {
    input: UpdateCategoryInput;
};

export type MutationUpdateCategoryMangaArgs = {
    input: UpdateCategoryMangaInput;
};

export type MutationUpdateCategoryOrderArgs = {
    input: UpdateCategoryOrderInput;
};

export type MutationUpdateChapterArgs = {
    input: UpdateChapterInput;
};

export type MutationUpdateChaptersArgs = {
    input: UpdateChaptersInput;
};

export type MutationUpdateExtensionArgs = {
    input: UpdateExtensionInput;
};

export type MutationUpdateExtensionsArgs = {
    input: UpdateExtensionsInput;
};

export type MutationUpdateLibraryArgs = {
    input: UpdateLibraryInput;
};

export type MutationUpdateLibraryMangaArgs = {
    input: UpdateLibraryMangaInput;
};

export type MutationUpdateMangaArgs = {
    input: UpdateMangaInput;
};

export type MutationUpdateMangaCategoriesArgs = {
    input: UpdateMangaCategoriesInput;
};

export type MutationUpdateMangasArgs = {
    input: UpdateMangasInput;
};

export type MutationUpdateMangasCategoriesArgs = {
    input: UpdateMangasCategoriesInput;
};

export type MutationUpdateSourcePreferenceArgs = {
    input: UpdateSourcePreferenceInput;
};

export type MutationUpdateStopArgs = {
    input: UpdateStopInput;
};

export type MutationUpdateTrackArgs = {
    input: UpdateTrackInput;
};

export type MutationUpdateTrackerOAuthAppArgs = {
    input: UpdateTrackerOAuthAppInput;
};

export type OsInfo = {
    __typename?: 'OSInfo';
    build?: Maybe<Scalars['String']['output']>;
    name: Scalars['String']['output'];
    version: Scalars['String']['output'];
};

export type PageInfo = {
    __typename?: 'PageInfo';
    endCursor?: Maybe<Scalars['Cursor']['output']>;
    hasNextPage: Scalars['Boolean']['output'];
    hasPreviousPage: Scalars['Boolean']['output'];
    startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type PartialBackupFlagsInput = {
    /** 服务端设置（9001）与各 meta 节（9000）。 */
    includeAppSettings?: InputMaybe<Scalars['Boolean']['input']>;
    includeCategories?: InputMaybe<Scalars['Boolean']['input']>;
    includeChapters?: InputMaybe<Scalars['Boolean']['input']>;
    /** 插件仓库（106）。 */
    includeExtensionStores?: InputMaybe<Scalars['Boolean']['input']>;
    includeHistory?: InputMaybe<Scalars['Boolean']['input']>;
    includeManga?: InputMaybe<Scalars['Boolean']['input']>;
    /** 凭据与认证信息，默认关闭。 */
    includePrivateSettings?: InputMaybe<Scalars['Boolean']['input']>;
    /** 除库内作品外，还带上「有已读章节但不在库」的作品。 */
    includeReadEntries?: InputMaybe<Scalars['Boolean']['input']>;
    /** 扩展自己存的图源设置（105）。 */
    includeSourceSettings?: InputMaybe<Scalars['Boolean']['input']>;
    includeTracking?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Mirrors `PartialSettingsTypeInput` — the full mutable settings surface of
 * the upstream WebUI (77 fields), aligned with `graphql-base.types.ts`.
 */
export type PartialSettingsTypeInput = {
    authMode?: InputMaybe<AuthMode>;
    authPassword?: InputMaybe<Scalars['String']['input']>;
    authUsername?: InputMaybe<Scalars['String']['input']>;
    autoBackupFrequency?: InputMaybe<Scalars['Int']['input']>;
    autoBackupIncludeAppSettings?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeCategories?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeChapters?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeExtensionStores?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeHistory?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeManga?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludePrivateSettings?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeReadEntries?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeSourceSettings?: InputMaybe<Scalars['Boolean']['input']>;
    autoBackupIncludeTracking?: InputMaybe<Scalars['Boolean']['input']>;
    autoDownloadIgnoreReUploads?: InputMaybe<Scalars['Boolean']['input']>;
    autoDownloadNewChapters?: InputMaybe<Scalars['Boolean']['input']>;
    autoDownloadNewChaptersLimit?: InputMaybe<Scalars['Int']['input']>;
    backupInterval?: InputMaybe<Scalars['Int']['input']>;
    backupPath?: InputMaybe<Scalars['String']['input']>;
    backupTTL?: InputMaybe<Scalars['Int']['input']>;
    backupTime?: InputMaybe<Scalars['String']['input']>;
    dataDir?: InputMaybe<Scalars['String']['input']>;
    databasePassword?: InputMaybe<Scalars['String']['input']>;
    databaseType?: InputMaybe<DatabaseType>;
    databaseUrl?: InputMaybe<Scalars['String']['input']>;
    databaseUsername?: InputMaybe<Scalars['String']['input']>;
    debugLogsEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    downloadAsCbz?: InputMaybe<Scalars['Boolean']['input']>;
    downloadConversions?: InputMaybe<Array<SettingsDownloadConversionTypeInput>>;
    downloadsPath?: InputMaybe<Scalars['String']['input']>;
    electronPath?: InputMaybe<Scalars['String']['input']>;
    excludeCompleted?: InputMaybe<Scalars['Boolean']['input']>;
    excludeEntryWithUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
    excludeNotStarted?: InputMaybe<Scalars['Boolean']['input']>;
    excludeUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
    flareSolverrAsResponseFallback?: InputMaybe<Scalars['Boolean']['input']>;
    flareSolverrEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    flareSolverrSessionName?: InputMaybe<Scalars['String']['input']>;
    flareSolverrSessionTtl?: InputMaybe<Scalars['Int']['input']>;
    flareSolverrTimeout?: InputMaybe<Scalars['Int']['input']>;
    flareSolverrUrl?: InputMaybe<Scalars['String']['input']>;
    globalUpdateInterval?: InputMaybe<Scalars['Float']['input']>;
    initialOpenInBrowserEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    ip?: InputMaybe<Scalars['String']['input']>;
    jwtAudience?: InputMaybe<Scalars['String']['input']>;
    jwtRefreshExpiry?: InputMaybe<Scalars['Duration']['input']>;
    jwtTokenExpiry?: InputMaybe<Scalars['Duration']['input']>;
    kcefEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    koreaderSyncChecksumMethod?: InputMaybe<KoreaderSyncChecksumMethod>;
    koreaderSyncPercentageTolerance?: InputMaybe<Scalars['Float']['input']>;
    koreaderSyncStrategyBackward?: InputMaybe<KoreaderSyncConflictStrategy>;
    koreaderSyncStrategyForward?: InputMaybe<KoreaderSyncConflictStrategy>;
    localSourcePath?: InputMaybe<Scalars['String']['input']>;
    maxLogFileSize?: InputMaybe<Scalars['String']['input']>;
    maxLogFiles?: InputMaybe<Scalars['Int']['input']>;
    maxLogFolderSize?: InputMaybe<Scalars['String']['input']>;
    maxSourcesInParallel?: InputMaybe<Scalars['Int']['input']>;
    opdsCbzMimetype?: InputMaybe<CbzMediaType>;
    opdsChapterSortOrder?: InputMaybe<SortOrder>;
    opdsEnablePageReadProgress?: InputMaybe<Scalars['Boolean']['input']>;
    opdsItemsPerPage?: InputMaybe<Scalars['Int']['input']>;
    opdsMarkAsReadOnDownload?: InputMaybe<Scalars['Boolean']['input']>;
    opdsShowOnlyDownloadedChapters?: InputMaybe<Scalars['Boolean']['input']>;
    opdsShowOnlyUnreadChapters?: InputMaybe<Scalars['Boolean']['input']>;
    opdsSkipChapterMetadataFeed?: InputMaybe<Scalars['Boolean']['input']>;
    opdsUseBinaryFileSizes?: InputMaybe<Scalars['Boolean']['input']>;
    port?: InputMaybe<Scalars['Int']['input']>;
    serveConversions?: InputMaybe<Array<SettingsDownloadConversionTypeInput>>;
    socksProxyEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    socksProxyHost?: InputMaybe<Scalars['String']['input']>;
    socksProxyPassword?: InputMaybe<Scalars['String']['input']>;
    socksProxyPort?: InputMaybe<Scalars['String']['input']>;
    socksProxyUsername?: InputMaybe<Scalars['String']['input']>;
    socksProxyVersion?: InputMaybe<Scalars['Int']['input']>;
    syncDataCategories?: InputMaybe<Scalars['Boolean']['input']>;
    syncDataChapters?: InputMaybe<Scalars['Boolean']['input']>;
    syncDataHistory?: InputMaybe<Scalars['Boolean']['input']>;
    syncDataManga?: InputMaybe<Scalars['Boolean']['input']>;
    syncDataTracking?: InputMaybe<Scalars['Boolean']['input']>;
    syncInterval?: InputMaybe<Scalars['Duration']['input']>;
    syncYomiApiKey?: InputMaybe<Scalars['String']['input']>;
    syncYomiEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    syncYomiHost?: InputMaybe<Scalars['String']['input']>;
    systemTrayEnabled?: InputMaybe<Scalars['Boolean']['input']>;
    updateMangas?: InputMaybe<Scalars['Boolean']['input']>;
    useHikariConnectionPool?: InputMaybe<Scalars['Boolean']['input']>;
    webUIChannel?: InputMaybe<WebUiChannel>;
    webUIFlavor?: InputMaybe<WebUiFlavor>;
    webUIInterface?: InputMaybe<WebUiInterface>;
    webUIUpdateCheckInterval?: InputMaybe<Scalars['Float']['input']>;
};

export type PlatformInfo = {
    __typename?: 'PlatformInfo';
    arch: Scalars['String']['output'];
    headless: Scalars['Boolean']['output'];
    jvm: JvmInfo;
    os: OsInfo;
};

/** Mirrors `union Preference = ...`. */
export type Preference =
    | CheckBoxPreference
    | EditTextPreference
    | ListPreference
    | MultiSelectListPreference
    | SwitchPreference;

export type PullKoSyncProgressInput = {
    chapterId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type PullKoSyncProgressPayload = {
    __typename?: 'PullKoSyncProgressPayload';
    chapter?: Maybe<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    syncConflict?: Maybe<SyncConflictInfoType>;
};

export type PushKoSyncProgressInput = {
    chapterId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type PushKoSyncProgressPayload = {
    __typename?: 'PushKoSyncProgressPayload';
    chapter?: Maybe<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    success: Scalars['Boolean']['output'];
};

export type Query = {
    __typename?: 'Query';
    /** Mirrors `aboutServer()` — full payload. */
    aboutServer: AboutServerPayload;
    /**
     * Mirrors `aboutWebUI()` — version from `<webui_dir>/version.txt`
     * (line 1) with the channel on line 2 (written by the WebUI's own build).
     */
    aboutWebUI: AboutWebUi;
    categories: CategoryNodeList;
    category: CategoryType;
    chapter: ChapterType;
    chapters: ChapterNodeList;
    /**
     * Mirrors `checkForServerUpdates()` — compares the local server build
     * with the latest 576576/Suwayomi-next release on GitHub. Empty when
     * up-to-date or the check fails.
     */
    checkForServerUpdates: Array<CheckForServerUpdatesPayload>;
    /**
     * Mirrors `checkForWebUIUpdate()` — compares the deployed WebUI version
     * (line 1 of `version.txt`) with the latest 576576/Suwayomi-WebUI release. Empty tag on network failure
     * (the WebUI then shows "unable to check for updates").
     */
    checkForWebUIUpdate: WebUiUpdateCheck;
    /** Mirrors `downloadStatus()` — current download queue / progress. */
    downloadStatus: DownloadStatus;
    /** Mirrors `extension(pkgName:)` — single extension. */
    extension: ExtensionType;
    /** Mirrors `extensionStore(indexUrl:)`. */
    extensionStore: ExtensionStoreType;
    /** Mirrors `extensionStores(condition:, order:)`. */
    extensionStores: ExtensionStoreNodeList;
    /** Mirrors `extensions(condition:, order:)`. */
    extensions: ExtensionNodeList;
    /** Mirrors `koSyncStatus()`. */
    koSyncStatus: KoSyncStatusPayload;
    /** Mirrors `lastSyncStatus()` — SyncYomi status. */
    lastSyncStatus?: Maybe<SyncStatus>;
    /** Mirrors `lastUpdateTimestamp()` — epoch-millis of the last finished global update. */
    lastUpdateTimestamp: LastUpdateTimestampPayload;
    /** Mirrors `libraryUpdateStatus()` — live status/progress of the global updater. */
    libraryUpdateStatus: LibraryUpdateStatus;
    manga: MangaType;
    mangas: MangaNodeList;
    /** Mirrors `meta(key:)` — single global meta entry. */
    meta: GlobalMetaType;
    /** Mirrors `metas(condition:)` — global meta list. */
    metas: GlobalMetaNodeList;
    /** Mirrors `restoreStatus(id:)` — result of the last restore with that id. */
    restoreStatus: BackupRestoreStatus;
    /**
     * Mirrors `searchTracker(input:)` — 结果会落 `track_search` 并参与绑定；
     * 未登录时直接报错。
     */
    searchTracker: SearchTrackerPayload;
    /** Mirrors `settings()` — full settings registry. */
    settings: SettingsType;
    /** Mirrors `source(id:)` — single source by id. */
    source: SourceType;
    /** Mirrors `sources(condition:, order:)`. */
    sources: SourceNodeList;
    /** Mirrors `trackRecord(id:)`. */
    trackRecord: TrackRecordType;
    /** Mirrors `trackRecords(condition:, order:)`. */
    trackRecords: TrackRecordNodeList;
    /** Mirrors `tracker(id:)` — single tracker metadata. */
    tracker: TrackerType;
    /** Mirrors `trackers(condition:, order:)`. */
    trackers: TrackerNodeList;
    /** Mirrors `updateStatus()` — deprecated library update status. */
    updateStatus: UpdateStatus;
    /** Mirrors `validateBackup(input:)` — reports missing sources without restoring. */
    validateBackup: ValidateBackupResult;
};

export type QueryCategoriesArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<CategoryConditionInput>;
    filter?: InputMaybe<CategoryFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<CategoryOrderInput>>;
};

export type QueryCategoryArgs = {
    id: Scalars['Int']['input'];
};

export type QueryChapterArgs = {
    id: Scalars['Int']['input'];
};

export type QueryChaptersArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<ChapterConditionInput>;
    filter?: InputMaybe<ChapterFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<ChapterOrderInput>>;
};

export type QueryExtensionArgs = {
    pkgName: Scalars['String']['input'];
};

export type QueryExtensionStoreArgs = {
    indexUrl: Scalars['String']['input'];
};

export type QueryExtensionStoresArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<ExtensionStoreConditionInput>;
    filter?: InputMaybe<ExtensionStoreFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<ExtensionStoreOrderInput>>;
};

export type QueryExtensionsArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<ExtensionConditionInput>;
    filter?: InputMaybe<ExtensionFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<ExtensionOrderInput>>;
};

export type QueryMangaArgs = {
    id: Scalars['Int']['input'];
};

export type QueryMangasArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<MangaConditionInput>;
    filter?: InputMaybe<MangaFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<MangaOrderInput>>;
};

export type QueryMetaArgs = {
    key: Scalars['String']['input'];
};

export type QueryMetasArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<MetaConditionInput>;
    filter?: InputMaybe<MetaFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<MetaOrderInput>>;
};

export type QueryRestoreStatusArgs = {
    id: Scalars['String']['input'];
};

export type QuerySearchTrackerArgs = {
    input: SearchTrackerInput;
};

export type QuerySourceArgs = {
    id: Scalars['LongString']['input'];
};

export type QuerySourcesArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<SourceConditionInput>;
    filter?: InputMaybe<SourceFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<SourceOrderInput>>;
};

export type QueryTrackRecordArgs = {
    id: Scalars['Int']['input'];
};

export type QueryTrackRecordsArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<TrackRecordConditionInput>;
    filter?: InputMaybe<TrackRecordFilterInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<TrackRecordOrderInput>>;
};

export type QueryTrackerArgs = {
    id: Scalars['Int']['input'];
};

export type QueryTrackersArgs = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    condition?: InputMaybe<TrackerConditionInput>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
    offset?: InputMaybe<Scalars['Int']['input']>;
    order?: InputMaybe<Array<TrackerOrderInput>>;
};

export type QueryValidateBackupArgs = {
    input: ValidateBackupInput;
};

/**
 * 「重建下载索引」：强制用磁盘上的 `<数据目录>/downloads/**` 重新对账数据库。
 *
 * 与 `reconcile_downloads` 同一套逻辑（启动时也会跑一次），差别只是这里由用户
 * 手动触发 —— 手工往下载目录里丢了 CBZ、或换了存储位置之后，不用重启就能重新
 * 扫出来。没有开关参数：它只读磁盘、只补/修下载标记，不删用户文件。
 */
export type RebuildDownloadIndexInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type RebuildDownloadIndexPayload = {
    __typename?: 'RebuildDownloadIndexPayload';
    /** 本次扫描到的章节归档数（含此前已经索引过的）。 */
    chapters: Scalars['Int']['output'];
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RefreshTokenInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    refreshToken: Scalars['String']['input'];
};

export type RefreshTokenPayload = {
    __typename?: 'RefreshTokenPayload';
    accessToken: Scalars['String']['output'];
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type RefreshTrackerUserInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    trackerId: Scalars['Int']['input'];
};

export type RefreshTrackerUserPayload = {
    __typename?: 'RefreshTrackerUserPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    tracker: TrackerType;
};

export type RemoveExtensionStoreInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    indexUrl: Scalars['String']['input'];
};

export type RemoveExtensionStorePayload = {
    __typename?: 'RemoveExtensionStorePayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extensionStore?: Maybe<ExtensionStoreType>;
};

export type ReorderChapterDownloadInput = {
    chapterId: Scalars['Int']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    to: Scalars['Int']['input'];
};

export type ReorderChapterDownloadPayload = {
    __typename?: 'ReorderChapterDownloadPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type ReorderChapterDownloadsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    reorders: Array<ChapterDownloadReorderInput>;
};

export type ReorderChapterDownloadsPayload = {
    __typename?: 'ReorderChapterDownloadsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type ResetSettingsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type ResetSettingsPayload = {
    __typename?: 'ResetSettingsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    settings: SettingsType;
};

export type RestoreBackupInput = {
    backup: Scalars['Upload']['input'];
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    flags?: InputMaybe<PartialBackupFlagsInput>;
};

export type RestoreBackupPayload = {
    __typename?: 'RestoreBackupPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    id: Scalars['String']['output'];
    status?: Maybe<BackupRestoreStatus>;
};

export type SearchTrackerInput = {
    query: Scalars['String']['input'];
    trackerId: Scalars['Int']['input'];
};

/** Mirrors `SearchTrackerPayload`. */
export type SearchTrackerPayload = {
    __typename?: 'SearchTrackerPayload';
    trackSearches: Array<TrackSearchType>;
};

export type SelectFilter = {
    __typename?: 'SelectFilter';
    default: Scalars['Int']['output'];
    name: Scalars['String']['output'];
    values: Array<Scalars['String']['output']>;
};

export type SeparatorFilter = {
    __typename?: 'SeparatorFilter';
    name: Scalars['String']['output'];
};

export type SetCategoryMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    meta: CategoryMetaTypeInput;
};

export type SetCategoryMetaPayload = {
    __typename?: 'SetCategoryMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta: CategoryMetaType;
};

export type SetCategoryMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<SetCategoryMetasItemInput>;
};

export type SetCategoryMetasItemInput = {
    categoryIds: Array<Scalars['Int']['input']>;
    metas: Array<MetaInput>;
};

export type SetCategoryMetasPayload = {
    __typename?: 'SetCategoryMetasPayload';
    categories: Array<CategoryType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<CategoryMetaType>;
};

export type SetChapterMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    meta: ChapterMetaTypeInput;
};

export type SetChapterMetaPayload = {
    __typename?: 'SetChapterMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta: ChapterMetaType;
};

export type SetChapterMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<SetChapterMetasItemInput>;
};

export type SetChapterMetasItemInput = {
    chapterIds: Array<Scalars['Int']['input']>;
    metas: Array<MetaInput>;
};

export type SetChapterMetasPayload = {
    __typename?: 'SetChapterMetasPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<ChapterMetaType>;
};

export type SetGlobalMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    meta: GlobalMetaTypeInput;
};

export type SetGlobalMetaPayload = {
    __typename?: 'SetGlobalMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta: GlobalMetaType;
};

export type SetGlobalMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    metas: Array<MetaInput>;
};

export type SetGlobalMetasPayload = {
    __typename?: 'SetGlobalMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<GlobalMetaType>;
};

export type SetMangaMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    meta: MangaMetaTypeInput;
};

export type SetMangaMetaPayload = {
    __typename?: 'SetMangaMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta: MangaMetaType;
};

export type SetMangaMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<SetMangaMetasItemInput>;
};

export type SetMangaMetasItemInput = {
    mangaIds: Array<Scalars['Int']['input']>;
    metas: Array<MetaInput>;
};

export type SetMangaMetasPayload = {
    __typename?: 'SetMangaMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    mangas: Array<MangaType>;
    metas: Array<MangaMetaType>;
};

export type SetSettingsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    settings: PartialSettingsTypeInput;
};

export type SetSettingsPayload = {
    __typename?: 'SetSettingsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    settings: SettingsType;
};

export type SetSourceMetaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    meta: SourceMetaTypeInput;
};

export type SetSourceMetaPayload = {
    __typename?: 'SetSourceMetaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    meta: SourceMetaType;
};

export type SetSourceMetasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    items: Array<SetSourceMetasItemInput>;
};

export type SetSourceMetasItemInput = {
    metas: Array<MetaInput>;
    sourceIds: Array<Scalars['LongString']['input']>;
};

export type SetSourceMetasPayload = {
    __typename?: 'SetSourceMetasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    metas: Array<SourceMetaType>;
    sources: Array<SourceType>;
};

/** Mirrors `SettingsDownloadConversionHeaderType`. */
export type SettingsDownloadConversionHeaderType = {
    __typename?: 'SettingsDownloadConversionHeaderType';
    name: Scalars['String']['output'];
    value: Scalars['String']['output'];
};

/** Mirrors `SettingsDownloadConversionHeaderTypeInput` (WebUI r3474). */
export type SettingsDownloadConversionHeaderTypeInput = {
    name: Scalars['String']['input'];
    value: Scalars['String']['input'];
};

/**
 * Mirrors `SettingsDownloadConversionType`.
 *
 * 三个字段都可空：`callTimeout`/`connectTimeout`/`headers` 是可选覆盖项，缺省表示沿用
 * 全局默认值；把它们当必填会凭空造出一个「0 秒超时 / 空 headers」的假值。
 */
export type SettingsDownloadConversionType = {
    __typename?: 'SettingsDownloadConversionType';
    callTimeout?: Maybe<Scalars['Duration']['output']>;
    compressionLevel?: Maybe<Scalars['Float']['output']>;
    connectTimeout?: Maybe<Scalars['Duration']['output']>;
    headers?: Maybe<Array<SettingsDownloadConversionHeaderType>>;
    mimeType: Scalars['String']['output'];
    target: Scalars['String']['output'];
};

/** Mirrors `SettingsDownloadConversionTypeInput` (WebUI r3474). */
export type SettingsDownloadConversionTypeInput = {
    callTimeout?: InputMaybe<Scalars['Duration']['input']>;
    compressionLevel?: InputMaybe<Scalars['Float']['input']>;
    connectTimeout?: InputMaybe<Scalars['Duration']['input']>;
    headers?: InputMaybe<Array<SettingsDownloadConversionHeaderTypeInput>>;
    mimeType: Scalars['String']['input'];
    target: Scalars['String']['input'];
};

/** Mirrors `SettingsType` — 96 fields generated from ServerConfig in Kotlin. */
export type SettingsType = {
    __typename?: 'SettingsType';
    authMode: AuthMode;
    authPassword: Scalars['String']['output'];
    authUsername: Scalars['String']['output'];
    /**
     * Auto backup cadence in minutes (0 = disabled). UI slider offers
     * off / 1-12 hours / 1-6 days / weekly; default 43200 (12 hours).
     */
    autoBackupFrequency: Scalars['Int']['output'];
    autoBackupIncludeAppSettings: Scalars['Boolean']['output'];
    autoBackupIncludeCategories: Scalars['Boolean']['output'];
    autoBackupIncludeChapters: Scalars['Boolean']['output'];
    autoBackupIncludeExtensionStores: Scalars['Boolean']['output'];
    autoBackupIncludeHistory: Scalars['Boolean']['output'];
    autoBackupIncludeManga: Scalars['Boolean']['output'];
    autoBackupIncludePrivateSettings: Scalars['Boolean']['output'];
    autoBackupIncludeReadEntries: Scalars['Boolean']['output'];
    autoBackupIncludeSourceSettings: Scalars['Boolean']['output'];
    autoBackupIncludeTracking: Scalars['Boolean']['output'];
    /** @deprecated Replaced with autoDownloadNewChaptersLimit */
    autoDownloadAheadLimit: Scalars['Int']['output'];
    autoDownloadIgnoreReUploads: Scalars['Boolean']['output'];
    autoDownloadNewChapters: Scalars['Boolean']['output'];
    autoDownloadNewChaptersLimit: Scalars['Int']['output'];
    backupInterval: Scalars['Int']['output'];
    backupPath: Scalars['String']['output'];
    backupTTL: Scalars['Int']['output'];
    backupTime: Scalars['String']['output'];
    /** @deprecated Removed - prefer authMode */
    basicAuthEnabled: Scalars['Boolean']['output'];
    /** @deprecated Removed - prefer authPassword */
    basicAuthPassword: Scalars['String']['output'];
    /** @deprecated Removed - prefer authUsername */
    basicAuthUsername: Scalars['String']['output'];
    /**
     * 数据（存储位置）目录；留空 = 用默认目录。改动重启后生效。
     * **数据库文件不在这里** —— 它在 appdata 根下的 `db/`（见
     * `suwayomi_core::config::AppPaths::db`），所以这个目录可以随便换而不会把设置本身弄丢。
     */
    dataDir: Scalars['String']['output'];
    databasePassword: Scalars['String']['output'];
    databaseType: DatabaseType;
    databaseUrl: Scalars['String']['output'];
    databaseUsername: Scalars['String']['output'];
    debugLogsEnabled: Scalars['Boolean']['output'];
    downloadAsCbz: Scalars['Boolean']['output'];
    downloadConversions: Array<SettingsDownloadConversionType>;
    downloadsPath: Scalars['String']['output'];
    electronPath: Scalars['String']['output'];
    excludeCompleted: Scalars['Boolean']['output'];
    excludeEntryWithUnreadChapters: Scalars['Boolean']['output'];
    excludeNotStarted: Scalars['Boolean']['output'];
    excludeUnreadChapters: Scalars['Boolean']['output'];
    /** @deprecated Replaced with addExtensionStore and removeExtensionStore mutations */
    extensionRepos: Array<Scalars['String']['output']>;
    flareSolverrAsResponseFallback: Scalars['Boolean']['output'];
    flareSolverrEnabled: Scalars['Boolean']['output'];
    flareSolverrSessionName: Scalars['String']['output'];
    flareSolverrSessionTtl: Scalars['Int']['output'];
    flareSolverrTimeout: Scalars['Int']['output'];
    flareSolverrUrl: Scalars['String']['output'];
    globalUpdateInterval: Scalars['Float']['output'];
    /** @deprecated Removed - does not do anything */
    gqlDebugLogsEnabled: Scalars['Boolean']['output'];
    initialOpenInBrowserEnabled: Scalars['Boolean']['output'];
    ip: Scalars['String']['output'];
    jwtAudience: Scalars['String']['output'];
    jwtRefreshExpiry: Scalars['Duration']['output'];
    jwtTokenExpiry: Scalars['Duration']['output'];
    kcefEnabled: Scalars['Boolean']['output'];
    koreaderSyncChecksumMethod: KoreaderSyncChecksumMethod;
    /** @deprecated Moved to preference store */
    koreaderSyncDeviceId: Scalars['String']['output'];
    koreaderSyncPercentageTolerance: Scalars['Float']['output'];
    /** @deprecated Moved to preference store */
    koreaderSyncServerUrl: Scalars['String']['output'];
    /** @deprecated Replaced with koreaderSyncStrategyForward and koreaderSyncStrategyBackward */
    koreaderSyncStrategy: KoreaderSyncLegacyStrategy;
    koreaderSyncStrategyBackward: KoreaderSyncConflictStrategy;
    koreaderSyncStrategyForward: KoreaderSyncConflictStrategy;
    /** @deprecated Moved to preference store */
    koreaderSyncUserkey: Scalars['String']['output'];
    /** @deprecated Moved to preference store */
    koreaderSyncUsername: Scalars['String']['output'];
    localSourcePath: Scalars['String']['output'];
    maxLogFileSize: Scalars['String']['output'];
    maxLogFiles: Scalars['Int']['output'];
    maxLogFolderSize: Scalars['String']['output'];
    maxSourcesInParallel: Scalars['Int']['output'];
    opdsCbzMimetype: CbzMediaType;
    opdsChapterSortOrder: SortOrder;
    opdsEnablePageReadProgress: Scalars['Boolean']['output'];
    opdsItemsPerPage: Scalars['Int']['output'];
    opdsMarkAsReadOnDownload: Scalars['Boolean']['output'];
    opdsShowOnlyDownloadedChapters: Scalars['Boolean']['output'];
    opdsShowOnlyUnreadChapters: Scalars['Boolean']['output'];
    opdsSkipChapterMetadataFeed: Scalars['Boolean']['output'];
    opdsUseBinaryFileSizes: Scalars['Boolean']['output'];
    port: Scalars['Int']['output'];
    serveConversions: Array<SettingsDownloadConversionType>;
    socksProxyEnabled: Scalars['Boolean']['output'];
    socksProxyHost: Scalars['String']['output'];
    socksProxyPassword: Scalars['String']['output'];
    socksProxyPort: Scalars['String']['output'];
    socksProxyUsername: Scalars['String']['output'];
    socksProxyVersion: Scalars['Int']['output'];
    syncDataCategories: Scalars['Boolean']['output'];
    syncDataChapters: Scalars['Boolean']['output'];
    syncDataHistory: Scalars['Boolean']['output'];
    syncDataManga: Scalars['Boolean']['output'];
    syncDataTracking: Scalars['Boolean']['output'];
    syncInterval: Scalars['Duration']['output'];
    syncYomiApiKey: Scalars['String']['output'];
    syncYomiEnabled: Scalars['Boolean']['output'];
    syncYomiHost: Scalars['String']['output'];
    systemTrayEnabled: Scalars['Boolean']['output'];
    updateMangas: Scalars['Boolean']['output'];
    useHikariConnectionPool: Scalars['Boolean']['output'];
    webUIChannel: WebUiChannel;
    webUIFlavor: WebUiFlavor;
    webUIInterface: WebUiInterface;
    webUIUpdateCheckInterval: Scalars['Float']['output'];
};

export type SortFilter = {
    __typename?: 'SortFilter';
    default?: Maybe<SortSelection>;
    name: Scalars['String']['output'];
    values: Array<Scalars['String']['output']>;
};

export enum SortOrder {
    Asc = 'ASC',
    Desc = 'DESC',
}

/** Mirrors `SortSelection` (SortFilter.default). */
export type SortSelection = {
    __typename?: 'SortSelection';
    ascending: Scalars['Boolean']['output'];
    index: Scalars['Int']['output'];
};

export type SortSelectionInput = {
    ascending: Scalars['Boolean']['input'];
    index: Scalars['Int']['input'];
};

/** Mirrors `SourceConditionInput`. */
export type SourceConditionInput = {
    contentWarning?: InputMaybe<ContentWarning>;
    id?: InputMaybe<Scalars['LongString']['input']>;
    lang?: InputMaybe<Scalars['String']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type SourceEdge = {
    __typename?: 'SourceEdge';
    cursor: Scalars['Cursor']['output'];
    node: SourceType;
};

export type SourceFilterInput = {
    and?: InputMaybe<Array<SourceFilterInput>>;
    contentWarning?: InputMaybe<ContentWarningFilterInput>;
    id?: InputMaybe<LongFilterInput>;
    lang?: InputMaybe<StringFilterInput>;
    name?: InputMaybe<StringFilterInput>;
    not?: InputMaybe<SourceFilterInput>;
    or?: InputMaybe<Array<SourceFilterInput>>;
};

export type SourceMetaType = {
    __typename?: 'SourceMetaType';
    key: Scalars['String']['output'];
    sourceId: Scalars['LongString']['output'];
    value: Scalars['String']['output'];
};

export type SourceMetaTypeInput = {
    key: Scalars['String']['input'];
    sourceId: Scalars['LongString']['input'];
    value: Scalars['String']['input'];
};

export type SourceNodeList = {
    __typename?: 'SourceNodeList';
    edges: Array<SourceEdge>;
    nodes: Array<SourceType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum SourceOrderBy {
    Id = 'ID',
    Lang = 'LANG',
    Name = 'NAME',
}

export type SourceOrderInput = {
    by: SourceOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type SourcePreferenceChangeInput = {
    checkBoxState?: InputMaybe<Scalars['Boolean']['input']>;
    editTextState?: InputMaybe<Scalars['String']['input']>;
    listState?: InputMaybe<Scalars['String']['input']>;
    multiSelectState?: InputMaybe<Array<Scalars['String']['input']>>;
    position?: InputMaybe<Scalars['Int']['input']>;
    switchState?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SourceType = {
    __typename?: 'SourceType';
    baseUrl?: Maybe<Scalars['String']['output']>;
    contentWarning: ContentWarning;
    displayName: Scalars['String']['output'];
    extension: ExtensionType;
    filters: Array<Filter>;
    homeUrl?: Maybe<Scalars['String']['output']>;
    iconUrl: Scalars['String']['output'];
    id: Scalars['LongString']['output'];
    isConfigurable: Scalars['Boolean']['output'];
    /**
     * True when the source's extension is listed by an extension store
     * (`extension_store` table) — the WebUI uses this to drive the "migrate"
     * picker on the sources list. Without this field the library/browse page
     * queries fail with "Unknown field 'isMigratable'" and the spinner
     * hangs forever.
     */
    isMigratable: Scalars['Boolean']['output'];
    isNsfw: Scalars['Boolean']['output'];
    lang: Scalars['String']['output'];
    manga: MangaNodeList;
    meta: Array<SourceMetaType>;
    name: Scalars['String']['output'];
    preferences: Array<Preference>;
    supportsLatest: Scalars['Boolean']['output'];
};

export type StartDownloaderInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StartDownloaderPayload = {
    __typename?: 'StartDownloaderPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type StartSyncInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StartSyncPayload = {
    __typename?: 'StartSyncPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    result: StartSyncResult;
};

export enum StartSyncResult {
    Success = 'SUCCESS',
    SyncDisabled = 'SYNC_DISABLED',
    SyncInProgress = 'SYNC_IN_PROGRESS',
}

export type StopDownloaderInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type StopDownloaderPayload = {
    __typename?: 'StopDownloaderPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    downloadStatus: DownloadStatus;
};

export type StringFilterInput = {
    distinctFrom?: InputMaybe<Scalars['String']['input']>;
    distinctFromAll?: InputMaybe<Array<Scalars['String']['input']>>;
    distinctFromAny?: InputMaybe<Array<Scalars['String']['input']>>;
    distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
    distinctFromInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    distinctFromInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    endsWith?: InputMaybe<Scalars['String']['input']>;
    endsWithAll?: InputMaybe<Array<Scalars['String']['input']>>;
    endsWithAny?: InputMaybe<Array<Scalars['String']['input']>>;
    endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
    endsWithInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    endsWithInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    equalTo?: InputMaybe<Scalars['String']['input']>;
    greaterThan?: InputMaybe<Scalars['String']['input']>;
    greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
    greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
    greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
    in?: InputMaybe<Array<Scalars['String']['input']>>;
    inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
    includes?: InputMaybe<Scalars['String']['input']>;
    includesAll?: InputMaybe<Array<Scalars['String']['input']>>;
    includesAny?: InputMaybe<Array<Scalars['String']['input']>>;
    includesInsensitive?: InputMaybe<Scalars['String']['input']>;
    includesInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    includesInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    isNull?: InputMaybe<Scalars['Boolean']['input']>;
    lessThan?: InputMaybe<Scalars['String']['input']>;
    lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
    lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
    lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
    like?: InputMaybe<Scalars['String']['input']>;
    likeAll?: InputMaybe<Array<Scalars['String']['input']>>;
    likeAny?: InputMaybe<Array<Scalars['String']['input']>>;
    likeInsensitive?: InputMaybe<Scalars['String']['input']>;
    likeInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    likeInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
    notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
    notEndsWith?: InputMaybe<Scalars['String']['input']>;
    notEndsWithAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notEndsWithAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
    notEndsWithInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notEndsWithInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notEqualTo?: InputMaybe<Scalars['String']['input']>;
    notEqualToAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notEqualToAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
    notEqualToInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notEqualToInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notIn?: InputMaybe<Array<Scalars['String']['input']>>;
    notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
    notIncludes?: InputMaybe<Scalars['String']['input']>;
    notIncludesAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notIncludesAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
    notIncludesInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notIncludesInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notLike?: InputMaybe<Scalars['String']['input']>;
    notLikeAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notLikeAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
    notLikeInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notLikeInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notStartsWith?: InputMaybe<Scalars['String']['input']>;
    notStartsWithAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notStartsWithAny?: InputMaybe<Array<Scalars['String']['input']>>;
    notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
    notStartsWithInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    notStartsWithInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWith?: InputMaybe<Scalars['String']['input']>;
    startsWithAll?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWithAny?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
    startsWithInsensitiveAll?: InputMaybe<Array<Scalars['String']['input']>>;
    startsWithInsensitiveAny?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Subscription = {
    __typename?: 'Subscription';
    /** Mirrors `downloadChanged` (deprecated). Streams live queue snapshots. */
    downloadChanged: DownloadStatus;
    /**
     * Mirrors `downloadStatusChanged(input:)`. Streams live queue snapshots
     * from the download manager's broadcast channel.
     */
    downloadStatusChanged: DownloadUpdates;
    /**
     * Mirrors `libraryUpdateStatusChanged(input:)`.
     * Streams live `LibraryUpdateStatus` snapshots from the updater's
     * broadcast channel (real events once `updateLibrary` starts a job).
     */
    libraryUpdateStatusChanged: UpdaterUpdates;
    /** Mirrors `syncStatusChanged`. */
    syncStatusChanged: SyncStatus;
    /** Mirrors `updateStatusChanged` (deprecated). */
    updateStatusChanged: UpdateStatus;
};

export type SubscriptionDownloadStatusChangedArgs = {
    input: DownloadChangedInput;
};

export type SubscriptionLibraryUpdateStatusChangedArgs = {
    input: LibraryUpdateStatusChangedInput;
};

export type SwitchPreference = {
    __typename?: 'SwitchPreference';
    currentValue?: Maybe<Scalars['Boolean']['output']>;
    default: Scalars['Boolean']['output'];
    enabled: Scalars['Boolean']['output'];
    key?: Maybe<Scalars['String']['output']>;
    summary?: Maybe<Scalars['String']['output']>;
    title?: Maybe<Scalars['String']['output']>;
    visible: Scalars['Boolean']['output'];
};

export type SyncConflictInfoType = {
    __typename?: 'SyncConflictInfoType';
    deviceName: Scalars['String']['output'];
    remotePage: Scalars['Int']['output'];
};

export enum SyncState {
    CreatingBackup = 'CREATING_BACKUP',
    Downloading = 'DOWNLOADING',
    Error = 'ERROR',
    Merging = 'MERGING',
    Restoring = 'RESTORING',
    Started = 'STARTED',
    Success = 'SUCCESS',
    Uploading = 'UPLOADING',
}

export type SyncStatus = {
    __typename?: 'SyncStatus';
    backupRestoreId?: Maybe<Scalars['String']['output']>;
    endDate?: Maybe<Scalars['LongString']['output']>;
    errorMessage?: Maybe<Scalars['String']['output']>;
    startDate: Scalars['LongString']['output'];
    state: SyncState;
};

export type TextFilter = {
    __typename?: 'TextFilter';
    default: Scalars['String']['output'];
    name: Scalars['String']['output'];
};

export type TrackProgressInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    mangaId: Scalars['Int']['input'];
};

export type TrackProgressPayload = {
    __typename?: 'TrackProgressPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecords: Array<TrackRecordType>;
};

export type TrackRecordConditionInput = {
    id?: InputMaybe<Scalars['Int']['input']>;
    mangaId?: InputMaybe<Scalars['Int']['input']>;
    remoteId?: InputMaybe<Scalars['LongString']['input']>;
    status?: InputMaybe<Scalars['Int']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
    trackerId?: InputMaybe<Scalars['Int']['input']>;
};

export type TrackRecordEdge = {
    __typename?: 'TrackRecordEdge';
    cursor: Scalars['Cursor']['output'];
    node: TrackRecordType;
};

export type TrackRecordFilterInput = {
    and?: InputMaybe<Array<TrackRecordFilterInput>>;
    mangaId?: InputMaybe<IntFilterInput>;
    not?: InputMaybe<TrackRecordFilterInput>;
    or?: InputMaybe<Array<TrackRecordFilterInput>>;
    title?: InputMaybe<StringFilterInput>;
    trackerId?: InputMaybe<IntFilterInput>;
};

export type TrackRecordNodeList = {
    __typename?: 'TrackRecordNodeList';
    edges: Array<TrackRecordEdge>;
    nodes: Array<TrackRecordType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

export enum TrackRecordOrderBy {
    FinishDate = 'FINISH_DATE',
    Id = 'ID',
    LastChapterRead = 'LAST_CHAPTER_READ',
    MangaId = 'MANGA_ID',
    Private = 'PRIVATE',
    RemoteId = 'REMOTE_ID',
    Score = 'SCORE',
    StartDate = 'START_DATE',
    Title = 'TITLE',
    TotalChapters = 'TOTAL_CHAPTERS',
    TrackerId = 'TRACKER_ID',
}

export type TrackRecordOrderInput = {
    by: TrackRecordOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type TrackRecordType = {
    __typename?: 'TrackRecordType';
    /** Mirrors `displayScore` — 用追踪器的展示口径渲染 `score`。 */
    displayScore: Scalars['String']['output'];
    finishDate: Scalars['LongString']['output'];
    id: Scalars['Int']['output'];
    lastChapterRead: Scalars['Float']['output'];
    libraryId?: Maybe<Scalars['LongString']['output']>;
    manga: MangaType;
    mangaId: Scalars['Int']['output'];
    private: Scalars['Boolean']['output'];
    remoteId: Scalars['LongString']['output'];
    remoteUrl: Scalars['String']['output'];
    score: Scalars['Float']['output'];
    startDate: Scalars['LongString']['output'];
    status: Scalars['Int']['output'];
    title: Scalars['String']['output'];
    totalChapters: Scalars['Int']['output'];
    tracker?: Maybe<TrackerType>;
    trackerId: Scalars['Int']['output'];
};

/** Mirrors `TrackSearchType`. */
export type TrackSearchType = {
    __typename?: 'TrackSearchType';
    coverUrl: Scalars['String']['output'];
    finishedReadingDate: Scalars['LongString']['output'];
    id: Scalars['Int']['output'];
    lastChapterRead: Scalars['Float']['output'];
    libraryId?: Maybe<Scalars['LongString']['output']>;
    private: Scalars['Boolean']['output'];
    publishingStatus: Scalars['String']['output'];
    publishingType: Scalars['String']['output'];
    remoteId: Scalars['LongString']['output'];
    score: Scalars['Float']['output'];
    startDate: Scalars['String']['output'];
    startedReadingDate: Scalars['LongString']['output'];
    status: Scalars['Int']['output'];
    summary: Scalars['String']['output'];
    title: Scalars['String']['output'];
    totalChapters: Scalars['Int']['output'];
    trackerId: Scalars['Int']['output'];
    trackingUrl: Scalars['String']['output'];
};

export type TrackStatusType = {
    __typename?: 'TrackStatusType';
    name: Scalars['String']['output'];
    value: Scalars['Int']['output'];
};

export type TrackerConditionInput = {
    icon?: InputMaybe<Scalars['String']['input']>;
    id?: InputMaybe<Scalars['Int']['input']>;
    isLoggedIn?: InputMaybe<Scalars['Boolean']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type TrackerEdge = {
    __typename?: 'TrackerEdge';
    cursor: Scalars['Cursor']['output'];
    node: TrackerType;
};

export type TrackerNodeList = {
    __typename?: 'TrackerNodeList';
    edges: Array<TrackerEdge>;
    nodes: Array<TrackerType>;
    pageInfo: PageInfo;
    totalCount: Scalars['Int']['output'];
};

/** 站点应用凭据（`trackers.json` 里的那一份）。 */
export type TrackerOAuthAppType = {
    __typename?: 'TrackerOAuthAppType';
    clientId: Scalars['String']['output'];
    clientSecret: Scalars['String']['output'];
    redirectUri: Scalars['String']['output'];
};

export enum TrackerOrderBy {
    Id = 'ID',
    IsLoggedIn = 'IS_LOGGED_IN',
    Name = 'NAME',
}

export type TrackerOrderInput = {
    by: TrackerOrderBy;
    byType?: InputMaybe<SortOrder>;
};

export type TrackerType = {
    __typename?: 'TrackerType';
    /** 已登录时给 null（上游 `TrackerType` 构造时就是这么定的）。 */
    authUrl?: Maybe<Scalars['String']['output']>;
    icon: Scalars['String']['output'];
    id: Scalars['Int']['output'];
    isLoggedIn: Scalars['Boolean']['output'];
    isTokenExpired: Scalars['Boolean']['output'];
    name: Scalars['String']['output'];
    /** 站点应用凭据；非 OAuth 站点（MangaUpdates）为 null。 */
    oauthApp?: Maybe<TrackerOAuthAppType>;
    scores: Array<Scalars['String']['output']>;
    statuses: Array<TrackStatusType>;
    supportsPrivateTracking: Scalars['Boolean']['output'];
    supportsReadingDates: Scalars['Boolean']['output'];
    supportsTrackDeletion: Scalars['Boolean']['output'];
    trackRecords: TrackRecordNodeList;
};

/** Mirrors `TriState` (TriStateFilter.default). */
export enum TriState {
    Exclude = 'EXCLUDE',
    Ignore = 'IGNORE',
    Include = 'INCLUDE',
}

export type TriStateFilter = {
    __typename?: 'TriStateFilter';
    default: TriState;
    name: Scalars['String']['output'];
};

export type UnbindTrackInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    deleteRemoteTrack?: InputMaybe<Scalars['Boolean']['input']>;
    recordId: Scalars['Int']['input'];
};

export type UnbindTrackPayload = {
    __typename?: 'UnbindTrackPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecord?: Maybe<TrackRecordType>;
};

export type UpdateCategoriesInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
    patch: UpdateCategoryPatchInput;
};

export type UpdateCategoriesPayload = {
    __typename?: 'UpdateCategoriesPayload';
    categories: Array<CategoryType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
    patch: UpdateCategoryPatchInput;
};

export type UpdateCategoryMangaInput = {
    categories: Array<Scalars['Int']['input']>;
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryMangaPayload = {
    __typename?: 'UpdateCategoryMangaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    updateStatus: UpdateStatus;
};

export type UpdateCategoryOrderInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
    position: Scalars['Int']['input'];
};

export type UpdateCategoryOrderPayload = {
    __typename?: 'UpdateCategoryOrderPayload';
    categories: Array<CategoryType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateCategoryPatchInput = {
    default?: InputMaybe<Scalars['Boolean']['input']>;
    includeInDownload?: InputMaybe<IncludeOrExclude>;
    includeInUpdate?: InputMaybe<IncludeOrExclude>;
    name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryPayload = {
    __typename?: 'UpdateCategoryPayload';
    category: CategoryType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChapterInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
    patch: UpdateChapterPatchInput;
};

export type UpdateChapterPatchInput = {
    isBookmarked?: InputMaybe<Scalars['Boolean']['input']>;
    isRead?: InputMaybe<Scalars['Boolean']['input']>;
    lastPageRead?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateChapterPayload = {
    __typename?: 'UpdateChapterPayload';
    chapter: ChapterType;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateChaptersInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
    patch: UpdateChapterPatchInput;
};

export type UpdateChaptersPayload = {
    __typename?: 'UpdateChaptersPayload';
    chapters: Array<ChapterType>;
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export type UpdateExtensionInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['String']['input'];
    patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionPatchInput = {
    install?: InputMaybe<Scalars['Boolean']['input']>;
    uninstall?: InputMaybe<Scalars['Boolean']['input']>;
    update?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateExtensionPayload = {
    __typename?: 'UpdateExtensionPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extension?: Maybe<ExtensionType>;
};

export type UpdateExtensionsInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['String']['input']>;
    patch: UpdateExtensionPatchInput;
};

export type UpdateExtensionsPayload = {
    __typename?: 'UpdateExtensionsPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    extensions: Array<ExtensionType>;
};

export type UpdateLibraryInput = {
    categories?: InputMaybe<Array<Scalars['Int']['input']>>;
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLibraryMangaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLibraryMangaPayload = {
    __typename?: 'UpdateLibraryMangaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    updateStatus: UpdateStatus;
};

export type UpdateLibraryPayload = {
    __typename?: 'UpdateLibraryPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    updateStatus: LibraryUpdateStatus;
};

export type UpdateMangaCategoriesInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
    patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangaCategoriesPatchInput = {
    addToCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
    clearCategories?: InputMaybe<Scalars['Boolean']['input']>;
    removeFromCategories?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type UpdateMangaCategoriesPayload = {
    __typename?: 'UpdateMangaCategoriesPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    manga: MangaType;
};

export type UpdateMangaInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    id: Scalars['Int']['input'];
    patch: UpdateMangaPatchInput;
};

export type UpdateMangaPatchInput = {
    inLibrary?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMangaPayload = {
    __typename?: 'UpdateMangaPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    manga: MangaType;
};

export type UpdateMangasCategoriesInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
    patch: UpdateMangaCategoriesPatchInput;
};

export type UpdateMangasCategoriesPayload = {
    __typename?: 'UpdateMangasCategoriesPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    mangas: Array<MangaType>;
};

export type UpdateMangasInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    ids: Array<Scalars['Int']['input']>;
    patch: UpdateMangaPatchInput;
};

export type UpdateMangasPayload = {
    __typename?: 'UpdateMangasPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    mangas: Array<MangaType>;
};

export type UpdateSourcePreferenceInput = {
    change: SourcePreferenceChangeInput;
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    source: Scalars['LongString']['input'];
};

export type UpdateSourcePreferencePayload = {
    __typename?: 'UpdateSourcePreferencePayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    preferences: Array<Preference>;
    source: SourceType;
};

/** Mirrors `UpdateStatus` — deprecated query payload (idle). */
export type UpdateStatus = {
    __typename?: 'UpdateStatus';
    completeJobs: UpdateStatusType;
    failedJobs: UpdateStatusType;
    isRunning: Scalars['Boolean']['output'];
    pendingJobs: UpdateStatusType;
    runningJobs: UpdateStatusType;
    skippedCategories: UpdateStatusCategoryType;
    skippedJobs: UpdateStatusType;
    updatingCategories: UpdateStatusCategoryType;
};

export type UpdateStatusCategoryType = {
    __typename?: 'UpdateStatusCategoryType';
    categories: CategoryNodeList;
};

export type UpdateStatusType = {
    __typename?: 'UpdateStatusType';
    mangas: MangaNodeList;
};

export type UpdateStopInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStopPayload = {
    __typename?: 'UpdateStopPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
};

export enum UpdateStrategy {
    AlwaysUpdate = 'ALWAYS_UPDATE',
    OnlyFetchOnce = 'ONLY_FETCH_ONCE',
}

export type UpdateTrackInput = {
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    finishDate?: InputMaybe<Scalars['LongString']['input']>;
    lastChapterRead?: InputMaybe<Scalars['Float']['input']>;
    private?: InputMaybe<Scalars['Boolean']['input']>;
    recordId: Scalars['Int']['input'];
    scoreString?: InputMaybe<Scalars['String']['input']>;
    startDate?: InputMaybe<Scalars['LongString']['input']>;
    status?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateTrackPayload = {
    __typename?: 'UpdateTrackPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    trackRecord?: Maybe<TrackRecordType>;
};

/** 站点应用凭据（`trackers.json`）。留空 = 回到内置默认值。 */
export type UpdateTrackerOAuthAppInput = {
    clientId?: InputMaybe<Scalars['String']['input']>;
    clientMutationId?: InputMaybe<Scalars['String']['input']>;
    clientSecret?: InputMaybe<Scalars['String']['input']>;
    redirectUri?: InputMaybe<Scalars['String']['input']>;
    trackerId: Scalars['Int']['input'];
};

export type UpdateTrackerOAuthAppPayload = {
    __typename?: 'UpdateTrackerOAuthAppPayload';
    clientMutationId?: Maybe<Scalars['String']['output']>;
    tracker: TrackerType;
};

export type UpdaterJobsInfoType = {
    __typename?: 'UpdaterJobsInfoType';
    finishedJobs: Scalars['Int']['output'];
    isRunning: Scalars['Boolean']['output'];
    skippedCategoriesCount: Scalars['Int']['output'];
    skippedMangasCount: Scalars['Int']['output'];
    totalJobs: Scalars['Int']['output'];
};

export type UpdaterUpdates = {
    __typename?: 'UpdaterUpdates';
    categoryUpdates: Array<CategoryUpdateType>;
    initial?: Maybe<LibraryUpdateStatus>;
    jobsInfo: UpdaterJobsInfoType;
    mangaUpdates: Array<MangaUpdateType>;
    omittedUpdates: Scalars['Boolean']['output'];
};

export type ValidateBackupInput = {
    backup: Scalars['Upload']['input'];
};

export type ValidateBackupResult = {
    __typename?: 'ValidateBackupResult';
    missingSources: Array<ValidateBackupSource>;
    missingTrackers: Array<ValidateBackupTracker>;
};

export type ValidateBackupSource = {
    __typename?: 'ValidateBackupSource';
    id: Scalars['LongString']['output'];
    name: Scalars['String']['output'];
};

export type ValidateBackupTracker = {
    __typename?: 'ValidateBackupTracker';
    name: Scalars['String']['output'];
};

export enum WebUiChannel {
    Bundled = 'BUNDLED',
    Preview = 'PREVIEW',
    Stable = 'STABLE',
}

export enum WebUiFlavor {
    Custom = 'CUSTOM',
    Vui = 'VUI',
    Webui = 'WEBUI',
}

export enum WebUiInterface {
    Browser = 'BROWSER',
    Electron = 'ELECTRON',
}

export type WebUiUpdateCheck = {
    __typename?: 'WebUIUpdateCheck';
    channel: WebUiChannel;
    tag: Scalars['String']['output'];
    updateAvailable: Scalars['Boolean']['output'];
};
