import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type posts = {
  id: Generated<string>;
  title: string;
  content: string;
  published: Generated<number>;
  created_at: Generated<string>;
  updated_at: Generated<string>;
  author_id: string;
};
export type DB = {
  posts: posts;
};
