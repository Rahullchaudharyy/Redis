import type { Collection } from "../../interface/collection";
import type { SDGITEM } from "../../interface/sdg";
import { client } from "../actions";

export const getSdgsList = async (page: number = 1, filter?: string) => {

    const req = await client
        .get("/api/collections/sdg_list/records", {
            sort: "-created",
            perPage: 20,
            page: page,
            filter: filter || "",
        })
        .send<Collection<SDGITEM>>();
    return req;
};
