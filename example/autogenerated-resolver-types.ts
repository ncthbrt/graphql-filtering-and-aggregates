import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Cursor: any;
};



export type Food = {
  __typename?: 'Food';
  name?: Maybe<Scalars['String']>;
  pricePerKg: Scalars['Float'];
};

export type FoodEdge = {
  __typename?: 'FoodEdge';
  node: Food;
  cursor: Scalars['Cursor'];
};

/**  Information about pagination in a connection.  */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

export type FoodConnection = {
  __typename?: 'FoodConnection';
  edges?: Maybe<Array<Maybe<FoodEdge>>>;
  pageInfo: PageInfo;
};

export type User = {
  __typename?: 'User';
  favouriteFoods?: Maybe<FoodConnection>;
};

export type Query = {
  __typename?: 'Query';
  user: User;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Cursor: ResolverTypeWrapper<Scalars['Cursor']>;
  Food: ResolverTypeWrapper<Food>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FoodEdge: ResolverTypeWrapper<FoodEdge>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FoodConnection: ResolverTypeWrapper<FoodConnection>;
  User: ResolverTypeWrapper<User>;
  Query: ResolverTypeWrapper<{}>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Cursor: Scalars['Cursor'];
  Food: Food;
  String: Scalars['String'];
  Float: Scalars['Float'];
  FoodEdge: FoodEdge;
  PageInfo: PageInfo;
  Boolean: Scalars['Boolean'];
  FoodConnection: FoodConnection;
  User: User;
  Query: {};
};

export type InjectAggregateDirectiveArgs = {  };

export type InjectAggregateDirectiveResolver<Result, Parent, ContextType = any, Args = InjectAggregateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type FoodResolvers<ContextType = any, ParentType extends ResolversParentTypes['Food'] = ResolversParentTypes['Food']> = {
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pricePerKg?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoodEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodEdge'] = ResolversParentTypes['FoodEdge']> = {
  node?: Resolver<ResolversTypes['Food'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['Cursor'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoodConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodConnection'] = ResolversParentTypes['FoodConnection']> = {
  edges?: Resolver<Maybe<Array<Maybe<ResolversTypes['FoodEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  favouriteFoods?: Resolver<Maybe<ResolversTypes['FoodConnection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Cursor?: GraphQLScalarType;
  Food?: FoodResolvers<ContextType>;
  FoodEdge?: FoodEdgeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  FoodConnection?: FoodConnectionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
  injectAggregate?: InjectAggregateDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;