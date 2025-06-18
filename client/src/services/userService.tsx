export async function getUsersService(): Promise<Response> {
  return fetch("/api/users");
}
