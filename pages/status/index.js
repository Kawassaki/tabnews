import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseStatusInformation = "Loading...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>Postgress version: {data.dependencies.database.version}</div>
        <div>
          Open connections: {data.dependencies.database.opened_connections}
        </div>
        <div>Max connections: {data.dependencies.database.max_connections}</div>
      </>
    );
  }

  return (
    <div>
      <h2>Database</h2>
      {databaseStatusInformation}
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Loading...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-PT");
  }

  return <div>Last updated: {updatedAtText}</div>;
}
