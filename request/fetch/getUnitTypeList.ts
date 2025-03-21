import type { Collection } from "../../interface/collection";
import type { UnitItem } from "../../interface/units";
import { client } from "../actions";

export const getUnitTypes = async (
    page: number = 1,
    filter?: string,
    signal?: AbortSignal
) => {


    const req = await client
        .get("/api/collections/unit_types/records", {
            sort: "-created",
            perPage: 20,
            page: page,
            expand: "project_type,sdg",
            filter: filter || "",
        })
        .send<Collection<UnitItem>>();
    return req;
};
