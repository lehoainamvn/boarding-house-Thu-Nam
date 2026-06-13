import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Support both Render's DATABASE_URL or standard discrete env variables
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    }
  : {
      host: process.env.DB_SERVER || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "BSM_Management",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SERVER && process.env.DB_SERVER !== "localhost" && process.env.DB_SERVER !== "127.0.0.1"
        ? { rejectUnauthorized: false }
        : false
    };

const pgPool = new pg.Pool(poolConfig);

class MssqlConnectionPool {
  constructor(pgPool) {
    this.pgPool = pgPool;
  }

  request() {
    return new MssqlRequest(this);
  }
}

class MssqlTransaction {
  constructor(pool) {
    this.pool = pool; // MssqlConnectionPool instance
    this.client = null;
  }

  async begin() {
    this.client = await this.pool.pgPool.connect();
    await this.client.query("BEGIN");
  }

  async commit() {
    if (this.client) {
      await this.client.query("COMMIT");
      this.client.release();
      this.client = null;
    }
  }

  async rollback() {
    if (this.client) {
      await this.client.query("ROLLBACK");
      this.client.release();
      this.client = null;
    }
  }
}

class MssqlRequest {
  constructor(parent) {
    if (parent instanceof MssqlTransaction) {
      this.client = parent.client;
      this.pgPool = parent.pool.pgPool;
    } else {
      this.client = null;
      this.pgPool = parent.pgPool;
    }
    this.inputs = {};
  }

  input(name, type, value) {
    this.inputs[name] = value;
    return this;
  }

  async query(sqlText) {
    let paramCount = 1;
    const values = [];
    const paramMap = {};

    // 1. Convert SQL Server parameter format (@name) to PostgreSQL format ($1, $2, ...)
    // Avoid replacing string literals or email addresses by verifying if name exists in inputs
    const convertedSql = sqlText.replace(/@([a-zA-Z0-9_]+)/g, (match, paramName) => {
      if (paramName in this.inputs) {
        if (!paramMap[paramName]) {
          paramMap[paramName] = `$${paramCount}`;
          values.push(this.inputs[paramName]);
          paramCount++;
        }
        return paramMap[paramName];
      }
      return match;
    });

    // 2. Convert common SQL Server functions to PostgreSQL standard syntax
    let processedSql = convertedSql
      .replace(/GETDATE\(\)/gi, "CURRENT_TIMESTAMP")
      .replace(/ISNULL\(/gi, "COALESCE(");

    const runner = this.client || this.pgPool;
    const res = await runner.query(processedSql, values);

    return {
      recordset: res.rows,
      recordsets: [res.rows],
      rowsAffected: [res.rowCount]
    };
  }
}

export const poolPromise = Promise.resolve(new MssqlConnectionPool(pgPool));

export async function connect() {
  return poolPromise;
}

const typeMock = Object.assign(() => "Type", {
  toString: () => "Type"
});

const sql = {
  Int: "Int",
  NVarChar: typeMock,
  Decimal: typeMock,
  DateTime: "DateTime",
  Text: "Text",
  VarChar: typeMock,
  Transaction: MssqlTransaction,
  Request: MssqlRequest,
  connect: connect
};

pgPool.on("connect", () => {
  console.log("✅ PostgreSQL connected");
});

pgPool.on("error", (err) => {
  console.error("❌ PostgreSQL client pool error", err);
});

export default sql;
