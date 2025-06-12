/**
 * Retry a fetch request when transient errors occur.
 * Used to mitigate 502-504 responses from G-Portal.
 * @param input Request info passed to fetch
 * @param init Request init options
 * @param retries Number of retries
 * @param retryDelay Delay between retries in ms
 */
export default function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, retries?: number, retryDelay?: number): Promise<Response>;
