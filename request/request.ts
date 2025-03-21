import { ToPath } from "./to";

export class NextClient {
  baseUrl: string;
  private init: RequestInit;
  private searchParams: URLSearchParams | undefined;
  constructor(baseUrl: string, init?: RequestInit) {
    this.baseUrl = baseUrl;
    this.init = init || {
      method: "GET",
      cache: "no-store",
    };
  }

  private setSearchParams(params: { [key: string]: string | number }) {
    let searchParams: URLSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value.toString());
    });
    return searchParams; // Return this for chaining
  }

  get(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "GET", this.searchParams);
  }

  post(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "POST", this.searchParams);
  }

  put(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(path, this.baseUrl, this.init, "PUT", this.searchParams);
  }

  patch(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(
      path,
      this.baseUrl,
      this.init,
      "PATCH",
      this.searchParams
    );
  }

  delete(path: string, query?: { [key: string]: string | number }) {
    this.searchParams = this.setSearchParams(query ?? {});
    return new ToPath(
      path,
      this.baseUrl,
      this.init,
      "DELETE",
      this.searchParams
    );
  }
}
