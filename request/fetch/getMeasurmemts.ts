import type { Collection } from "../../interface/collection";
import type { MeasurementItem } from "../../interface/measurement";
import { client } from "../actions";

export const getMeasurements = async () => {
    const req = await client
        .get("/api/collections/measurements/records/", { perPage: 500 })
        .send<Collection<MeasurementItem>>();
    return req;
};