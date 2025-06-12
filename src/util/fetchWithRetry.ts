/**
 * Retry a fetch request when transient errors occur.
 * Used to mitigate 502-504 responses from G-Portal.
 * @param input Request info passed to fetch
 * @param init Request init options
 * @param retries Number of retries
 * @param retryDelay Delay between retries in ms
 */
export default async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  retries: number = 2,
  retryDelay: number = 1000
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await fetch(input, init);
      if (
        response.ok ||
        attempt >= retries ||
        ![502, 503, 504].includes(response.status)
      ) {
        return response;
      }
    } catch (error) {
      if (attempt >= retries) {
        throw error;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
  }
}
