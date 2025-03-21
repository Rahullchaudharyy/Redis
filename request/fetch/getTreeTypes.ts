import type { Collection } from "../../interface/collection";
import type { TreeTypesItem } from "../../interface/treetypes";
import { client } from "../actions";

export const getTreeTypes = async (
    page: number = 1,
    filter?: string,
    signal?: AbortSignal
) => {

    const req = await client
        .get("/api/collections/tree_types/records", {
            sort: "-created",
            perPage: 20,
            filter: filter || "",
            page: page,

        })
        .send<Collection<TreeTypesItem>>();
    return req;
};