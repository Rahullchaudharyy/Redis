import type { AcademicRequestsItem } from "../../interface/academics";
import type { Collection } from "../../interface/collection";
import { client } from "../actions";

export const getAcademicRequests = async (page: number = 1, filter?: string) => {
    return await client
        .get("/api/collections/academics_requests/records", {
            filter: filter || "",
            expand: "updateBy",
            page: page,
        })
        .send<Collection<AcademicRequestsItem>>();
};

