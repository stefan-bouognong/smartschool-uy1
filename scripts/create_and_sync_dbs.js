const mysql = require("mysql2/promise");
const path = require("path");

/**
 * @param {{ host: any; user: any; password: any; }} connConfig
 * @param {any} dbName
 */
async function createDatabaseIfNotExists(connConfig, dbName) {
  const { host, user, password } = connConfig;
  const connection = await mysql.createConnection({ host, user, password });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );
    console.log(`Database '${dbName}' ensured.`);
  } finally {
    await connection.end();
  }
}

/**
 * @param {string} servicePath
 */
async function syncServiceModels(servicePath) {
  try {
    const models = require(servicePath);
    if (
      models &&
      models.sequelize &&
      typeof models.sequelize.sync === "function"
    ) {
      await models.sequelize.sync();
      console.log(`Synced models for ${servicePath}`);
    } else if (models && models.sequelize) {
      console.log(
        `Found sequelize instance for ${servicePath}, but no sync() function.`,
      );
    } else {
      console.log(`No models with sequelize found at ${servicePath}`);
    }
  } catch (err) {
    console.error(
      `Error syncing models for ${servicePath}:`,
      // @ts-ignore
      err.message || err,
    );
  }
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const services = [
    {
      name: "auth",
      env: require(
        path.join(repoRoot, "services", "auth", "src", "config", "env.js"),
      ),
      modelsPath: path.join(
        repoRoot,
        "services",
        "auth",
        "src",
        "database",
        "models",
      ),
    },
    {
      name: "academic",
      env: require(
        path.join(repoRoot, "services", "academic", "src", "config", "env.js"),
      ),
      modelsPath: path.join(
        repoRoot,
        "services",
        "academic",
        "src",
        "database",
        "models",
      ),
    },
    {
      name: "student",
      env: require(
        path.join(repoRoot, "services", "student", "src", "config", "env.js"),
      ),
      modelsPath: path.join(
        repoRoot,
        "services",
        "student",
        "src",
        "database",
        "models",
      ),
    },
    {
      name: "finance",
      env: require(
        path.join(repoRoot, "services", "finance", "src", "config", "env.js"),
      ),
      modelsPath: path.join(
        repoRoot,
        "services",
        "finance",
        "src",
        "database",
        "models",
      ),
    },
    {
      name: "admin",
      env: require(
        path.join(repoRoot, "services", "admin", "src", "config", "env.js"),
      ),
      modelsPath: path.join(
        repoRoot,
        "services",
        "admin",
        "src",
        "database",
        "models",
      ),
    },
  ];

  // Use credentials from first service (assume same DB server/user)
  const connConfig = {
    host: services[0].env.db.host || "127.0.0.1",
    user: services[0].env.db.user || "root",
    password: services[0].env.db.password || "",
  };

  for (const svc of services) {
    const dbName = svc.env.db.database;
    if (!dbName) continue;
    try {
      await createDatabaseIfNotExists(connConfig, dbName);
    } catch (err) {
      // @ts-ignore
      console.error(`Failed to ensure database ${dbName}:`, err.message || err);
      process.exitCode = 1;
    }
  }

  // Sync models for each service
  for (const svc of services) {
    const modelsIndex = svc.modelsPath;
    await syncServiceModels(modelsIndex);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal error:", err.message || err);
  process.exit(1);
});
