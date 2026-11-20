import assert from "node:assert/strict";
import { test } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { deleteOrder, fetchCatalog } from "@/lib/supabase/data";

function clientWithDeleteResult(result: {
  data: { id: string } | null;
  error: Error | null;
}): SupabaseClient {
  return {
    from(table: string) {
      assert.equal(table, "orders");
      return {
        delete: () => ({
          eq: (column: string, id: string) => ({
            select: (columns: string) => ({
              maybeSingle: async () => {
                assert.equal(column, "id");
                assert.equal(id, "order-id");
                assert.equal(columns, "id");
                return result;
              },
            }),
          }),
        }),
      };
    },
  } as unknown as SupabaseClient;
}

function catalogClient(requestedTables: string[]): SupabaseClient {
  function queryBuilder() {
    const result = Promise.resolve({ data: [], error: null });
    return {
      select: queryBuilder,
      order: queryBuilder,
      then: result.then.bind(result),
    };
  }

  return {
    from(table: string) {
      requestedTables.push(table);
      return queryBuilder();
    },
  } as unknown as SupabaseClient;
}

test("catalog loading does not wait for reviews", async () => {
  const requestedTables: string[] = [];
  await fetchCatalog(catalogClient(requestedTables));
  assert.deepEqual(requestedTables.sort(), [
    "categories",
    "product_images",
    "product_variants",
    "products",
  ]);
});

test("deleteOrder succeeds only when the database returns the deleted order", async () => {
  await deleteOrder(clientWithDeleteResult({ data: { id: "order-id" }, error: null }), "order-id");
  await assert.rejects(
    deleteOrder(clientWithDeleteResult({ data: null, error: null }), "order-id"),
    /n'a pas été supprimée/,
  );
});

test("deleteOrder propagates database errors", async () => {
  const databaseError = new Error("permission denied");
  await assert.rejects(
    deleteOrder(clientWithDeleteResult({ data: null, error: databaseError }), "order-id"),
    (error) => error === databaseError,
  );
});
