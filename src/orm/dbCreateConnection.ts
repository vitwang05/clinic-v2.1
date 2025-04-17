import { Connection, createConnection, getConnectionManager } from "typeorm";

import config from "./config/ormconfig";

export const AppDataSource = async (): Promise<Connection> => {
  try {
    const conn = await createConnection(config);
    console.log(
      `Database connection success. Connection name: '${conn.name}' Database: '${conn.options.database}'`
    );
    return conn;
  } catch (err: any) {
    if (err.name === "AlreadyHasActiveConnectionError") {
      const activeConnection = getConnectionManager().get(config.name);
      return activeConnection;
    }
    console.error("Database connection error:", err);
    throw new Error("Failed to establish a database connection.");
  }
};
