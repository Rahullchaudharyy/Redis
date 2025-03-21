import { HttpError } from "./errror";
import { type TMethads } from "./to";

export class JsonRequest {
  private formData: Object;
  private path: string;
  private host: string;
  private init: RequestInit;
  private method: TMethads;
  private searchParams: URLSearchParams;
  constructor(
    formData: Record<string, any>,
    path: string,
    host: string,
    init: RequestInit,
    method: TMethads,
    searchParams: URLSearchParams
  ) {
    this.formData = formData;
    this.method = method;
    this.path = path;
    this.host = host;
    this.init = init;
    this.searchParams = searchParams;
  }
  async send<T>(headers?: RequestInit["headers"]): Promise<T> {
    try {
      const url = new URL(this.path, this.host);
      url.search = this.searchParams.toString();

      const response = await fetch(url, {
        ...this.init,

        headers: {
          "Content-Type": "application/json",
          ...this.init.headers,
          ...headers,
        },
        method: this.method,
        body: JSON.stringify(this.formData),
      });

      if (!response.ok) {
        // Try to parse the response as JSON
        let errorText: string | object;
        try {
          errorText = await response.json();
        } catch (jsonError) {
          // If parsing as JSON fails, fallback to text
          errorText = await response.text();
        }
        throw new HttpError(response.status, errorText);
      }

      // Check the Content-Type header to determine how to parse the response
      const contentType = response.headers.get("Content-Type") || "";

      if (contentType.includes("application/json")) {
        // Parse response body as JSON
        const responseData: T = await response.json();
        return responseData;
      } else if (contentType.includes("text/") || contentType == "") {
        // Parse response body as text
        const responseData: T = (await response.text()) as T;
        return responseData;
      } else {
        // Handle unexpected content types
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (error) {
      // Handle network errors or JSON parsing errors
      if (error instanceof HttpError) {
        console.error(`HTTP Error ${error.statusCode}:`, error.response);
      } else {
        console.error("Request failed:", error);
      }
      throw error;
    }
  }
}
