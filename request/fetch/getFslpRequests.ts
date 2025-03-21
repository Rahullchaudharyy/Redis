import type { Collection } from "../../interface/collection";
import type { FSLPItem } from "../../interface/fslp";
import { client } from "../actions";

export const getFslpRequests = async (page: number = 1,) => {
    const res = await client
        .get("/api/collections/fslp/records", {

            page: page,
            expand: "updateBy,user",
        })
        .send<Collection<FSLPItem>>();
    return res;
};
