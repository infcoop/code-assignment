import type { Insertable as _Insertable, Kysely, Transaction } from "kysely";

import type { DB } from "./types";

export type Insertable<T> = _Insertable<T>;

/**
 * A transaction or the main client
 */
export type KyselyTransaction = Transaction<DB> | Kysely<DB>;
