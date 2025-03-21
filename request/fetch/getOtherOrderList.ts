import type { Collection } from "../../interface/collection";
import type { OthersOrdersItem } from "../../interface/othersOrdersItem";
import { client } from "../actions";

export const getOthersOrdersList = async (
    page: number = 1,
    filter?: string
) => {
    const req = await client
        .get("/api/collections/other_projects_orders/records", {
            expand: "user,updatedBy,support,asigned_to,project",
            sort: "-created",
            perPage: 20,
            page: page,
            filter: filter || "",
        })
        .send<Collection<OthersOrdersItem>>();
    return req;
};