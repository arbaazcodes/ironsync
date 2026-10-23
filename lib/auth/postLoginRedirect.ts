/** Public authentication lands in the consumer app; gym login is explicit. */
export async function getPostLoginRedirect(_userId?: string | null, _client?: unknown): Promise<string> {
  return "/dashboard";
}
