
const DATABASE_URL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

export async function readData(path, idToken) {
  return requestDatabase(path, "GET", undefined, idToken);
}

export async function writeData(path, data, idToken) {
  return requestDatabase(path, "PUT", data, idToken);
}

export async function updateData(path, data, idToken) {
  return requestDatabase(path, "PATCH", data, idToken);
}

export async function addData(path, data, idToken) {
  return requestDatabase(path, "POST", data, idToken);
}

export async function deleteData(path, idToken) {
  return requestDatabase(path, "DELETE", undefined, idToken);
}

async function requestDatabase(path, method, body, idToken) {
  if (!DATABASE_URL) {
    throw new Error("Firebase database URL is missing.");
  }

  const cleanPath = path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");

  const url = new URL(
    `${DATABASE_URL.replace(/\/+$/, "")}/${cleanPath}.json`
  );

  if (idToken) {
    url.searchParams.set("auth", idToken);
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.error || `Database request failed (${response.status}).`
    );
  }

  return result;
}
