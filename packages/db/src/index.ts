import path from "node:path";
import { PrismaClient } from "@prisma/client";
import Database from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

import type { KyselyTransaction } from "./helpers";
import type { DB } from "./types";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

const dialect = new SqliteDialect({
  database: (() => {
    try {
      // @ts-expect-error - Prisma's internal API is not typed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const dbPath = path.join(prisma._engineConfig?.cwd, "dev.db");
      return new Database(dbPath);
    } catch (error) {
      console.error("Failed to initialize the database:", error);
      throw error;
    }
  })(),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (event.level === "error") {
      console.error(
        {
          durationMs: event.queryDurationMillis,
          error: event.error,
          sql: event.query.sql,
          params: event.query.parameters,
        },
        "Query Failed",
      );
    }
  },
});

export const sanitizeArray = (arr?: unknown[]) => {
  if (arr === undefined) {
    return arr;
  }

  return JSON.stringify(arr);
};

export const transactionize = <
  T extends KyselyTransaction | null,
  U extends unknown[],
  R,
>(
  callback: (trx: KyselyTransaction, ...args: U) => Promise<R>,
) => {
  return async (trx: T, ...args: U): Promise<R> => {
    if (trx?.isTransaction) {
      return await callback(trx, ...args);
    }

    return await (trx ?? db)
      .transaction()
      .execute(async (ttrx: KyselyTransaction) => {
        return await callback(ttrx, ...args);
      });
  };
};
