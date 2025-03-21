import type { Collection } from "../../interface/collection";
import type { TreeOrderItem } from "../../interface/treeOrders";
import { client } from "../actions";

export const getTreeOrders = async (
    page: number = 1
) => {

    const req = await client
        .get("/api/collections/tree_planting_orders/records", {
            expand: "user,user.company,asigned_to,type,support,updatedBy,project,support",
            sort: "-created",
            perPage: 20,
            page: page,

        })
        .send<Collection<TreeOrderItem>>();
    return req;
};
