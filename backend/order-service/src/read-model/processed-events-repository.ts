import type { PoolClient } from 'pg';

export interface IProcessedEventsRepository {
  hasEventBeenProcessed(client: PoolClient, eventId: string): Promise<boolean>;
  registerProcessedEvent(client: PoolClient, eventId: string): Promise<void>;
}

export class ProcessedEventsRepository implements IProcessedEventsRepository {
  public async hasEventBeenProcessed(
    client: PoolClient,
    eventId: string
  ): Promise<boolean> {
    const result = await client.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM processed_events WHERE event_id = $1) AS exists',
      [eventId]
    );
    return result.rows[0]?.exists === true;
  }

  public async registerProcessedEvent(client: PoolClient, eventId: string): Promise<void> {
    await client.query('INSERT INTO processed_events (event_id) VALUES ($1)', [eventId]);
  }
}
