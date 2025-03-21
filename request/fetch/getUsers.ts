import type { Collection } from "../../interface/collection";
import type { UserItem } from "../../interface/user";
import { client } from "../actions";

export const getUsers = async (
    page: number = 1,
    filter?: string,
  ) => {
    const req = await client
      .get("/api/collections/users/records", {
        sort: "-created",
        perPage: 20,
        page: page,
        filter: filter || "",
      })
      .send<Collection<UserItem>>();
    return req;
  };