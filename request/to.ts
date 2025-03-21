
import { FormRequest } from "./form";
import { JsonRequest } from "./json";

export type TMethads =
  | "GET"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH";

export class ToPath {
  private path: string;
  private host: string;
  private init: RequestInit;
  private method: TMethads;
  private searchParams: URLSearchParams;
  constructor(
    path: string,
    host: string,
    init: RequestInit,
    method: TMethads,
    searchParams: URLSearchParams
  ) {
    this.path = path;
    this.host = host;
    this.init = init;
    this.method = method;
    this.searchParams = searchParams;
  }

  private jsonToFormData(
    jsonObject: Record<string, any>,
    query?: { [key: string]: string | number }
  ): FormData {
    const formData = new FormData();

    // Iterate over the keys of the JSON object
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        // Append each key-value pair to the FormData object
        formData.append(key, jsonObject[key]);
      }
    }
    return formData;
  }

  form<T>(data: T | Record<string, any>) {
    const formData: FormData = this.jsonToFormData(data as Record<string, any>);
    return new FormRequest(
      formData,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams
    );
  }
  json<T>(data: T | Record<string, any>) {
    return new JsonRequest(
      data as Record<string, any>,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams
    );
  }
  async send<T>(headers?: RequestInit["headers"]) {
    const formData = new FormData();
    const request = new FormRequest(
      formData,
      this.path,
      this.host,
      this.init,
      this.method,
      this.searchParams
    );
    return await request.send<T>(headers);
  }
}
