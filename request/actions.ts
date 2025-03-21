import { NextClient } from "./request";

export const client = new NextClient("http://localhost:6410");

export function AdminAuthToken() {
  return { Authorization: "Bearer " + localStorage.getItem("token") || "" };
}

export const genPbFiles = (record: any, name: any) => {
  return `${client.baseUrl}/api/files/${record?.collectionId}/${record?.id}/${name}`;
};

export function extractErrors(errorResponse: {
  message?: any;
  data: { [key: string]: { message: string; code: number } };
}): string[] {
  try {
    const errors: string[] = [];

    // Check if the errorResponse contains data
    if (errorResponse && errorResponse.data) {
      // Iterate through the keys of the data object
      for (const [key, value] of Object.entries(errorResponse.data)) {
        // Remove underscores from the key
        const formattedKey = key.replace(/_/g, " ");
        // Construct a message for each error
        const message = `${formattedKey}: ${value.message}`;
        errors.push(message);
      }
    }
    console.log(errorResponse);

    return [...errors, errorResponse?.message || "something went wrong"];
  } catch (error) {
    return ["something went wrong"];
  }
}


export const loadPaginatedData = async <T>(
  fetchFunc: (page: number) => Promise<{ items: T[]; totalPages: number }>
): Promise<T[]> => {
  let page = 1;
  let allData: T[] = [];

  while (true) {
    const { items, totalPages } = await fetchFunc(page);
    allData = allData.concat(items);
    if (page >= totalPages) break;
    page++;
  }

  return allData;
};
