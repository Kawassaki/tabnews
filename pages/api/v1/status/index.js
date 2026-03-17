import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/contoller";
import authorization from "models/authorization.js";

const router = createRouter();
router.use(controller.injectAnonymousOrUser);
router.get(getHandler);
router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const userTryingToRead = request.context.user;

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;

  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  const databaseStatusObject = {
    updated_at: updatedAt,
    version: databaseVersionValue,
    max_connections: parseInt(databaseMaxConnectionsValue),
    opened_connections: databaseOpenedConnectionsValue,
  };

  const secureOutputValues = authorization.filterOutput(
    userTryingToRead,
    "read:status",
    databaseStatusObject,
  );

  return response.status(200).json(secureOutputValues);
}
