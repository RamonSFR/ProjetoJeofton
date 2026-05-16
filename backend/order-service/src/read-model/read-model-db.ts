import { Pool, type PoolClient, type QueryResultRow } from 'pg';

let readPool: Pool | null = null;

const getReadModelPool = (): Pool => {
  if (readPool) {
    return readPool;
  }
  const connectionString: string | undefined = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL nao configurada para query model');
  }
  readPool = new Pool({
    connectionString,
  });
  return readPool;
};

export const executeReadModelQuery = async <TRow extends QueryResultRow>(
  queryText: string,
  values: readonly unknown[] = []
): Promise<readonly TRow[]> => {
  const result = await getReadModelPool().query<TRow>(queryText, [...values]);
  return result.rows;
};

export const withReadModelTransaction = async <TResult>(
  operation: (client: PoolClient) => Promise<TResult>
): Promise<TResult> => {
  const client = await getReadModelPool().connect();
  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error: unknown) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closeReadModelPool = async (): Promise<void> => {
  if (!readPool) {
    return;
  }
  await readPool.end();
  readPool = null;
};
