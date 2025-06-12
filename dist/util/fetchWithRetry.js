"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchWithRetry;
/**
 * Retry a fetch request when transient errors occur.
 * Used to mitigate 502-504 responses from G-Portal.
 * @param input Request info passed to fetch
 * @param init Request init options
 * @param retries Number of retries
 * @param retryDelay Delay between retries in ms
 */
async function fetchWithRetry(input, init, retries = 2, retryDelay = 1000) {
    for (let attempt = 0;; attempt++) {
        try {
            const response = await fetch(input, init);
            if (response.ok ||
                attempt >= retries ||
                ![502, 503, 504].includes(response.status)) {
                return response;
            }
        }
        catch (error) {
            if (attempt >= retries) {
                throw error;
            }
        }
        await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
}
//# sourceMappingURL=fetchWithRetry.js.map
