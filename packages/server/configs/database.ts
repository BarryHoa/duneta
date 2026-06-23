export type PostgresConnection = {
  driver: 'postgres';
  url: string;
  schema?: string;
};

export type MysqlConnection = {
  driver: 'mysql';
  url: string;
};

export type SqliteConnection = {
  driver: 'sqlite';
  url: string;
};

export type DatabaseConnection = PostgresConnection | MysqlConnection | SqliteConnection;

export type DatabasePoolConfig = {
  max: number;
  idleTimeout: number;
  connectTimeout: number;
};

export const DEFAULT_DATABASE_POOL: DatabasePoolConfig = {
  max: 10,
  idleTimeout: 20,
  connectTimeout: 10,
};

export type DatabaseConfig<
  TConnections extends object = Record<string, DatabaseConnection>,
> = {
  default: string;
  connections: TConnections;
  pool: DatabasePoolConfig;
};

export function postgresConnection(options: { url: string; schema?: string }): PostgresConnection {
  return { driver: 'postgres', url: options.url, schema: options.schema };
}

export function mysqlConnection(options: { url: string }): MysqlConnection {
  return { driver: 'mysql', url: options.url };
}

export function sqliteConnection(options: { url: string }): SqliteConnection {
  return { driver: 'sqlite', url: options.url };
}

/** Drop undefined connections and preserve literal connection names for generics. */
export function defineConnections<const T extends Record<string, DatabaseConnection | undefined>>(
  connections: T,
) {
  const resolved = {} as {
    [K in keyof T as T[K] extends DatabaseConnection ? K : never]: NonNullable<T[K]>;
  };

  for (const [name, connection] of Object.entries(connections)) {
    if (connection) {
      Object.assign(resolved, { [name]: connection });
    }
  }

  return resolved;
}

export function connectionUrl(
  config: DatabaseConfig,
  name: string = config.default,
) {
  const connection = config.connections[name as keyof typeof config.connections] as
    | DatabaseConnection
    | undefined;
  return connection?.url;
}
