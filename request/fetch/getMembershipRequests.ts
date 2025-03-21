import type { Collection } from "../../interface/collection";
import type { MemberShipPayment } from "../../interface/membership";
import { client } from "../actions";

export const getMembershipRequests = async (page: number = 1) => {
    return await client
        .get("/api/collections/memberships_payments/records", {
            page,
            expand: "user,membership",
            filter: "(completeOrder=true)",
        })
        .send<Collection<MemberShipPayment>>();
};