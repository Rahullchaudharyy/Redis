import type { ProjectItem } from "./project";
import { UserItem } from "./user";

export interface OthersOrdersItem {
    amount: number;
    asigned_to: string;
    collectionId: string;
    collectionName: string;
    created: string;
    expand: Expand;
    id: string;
    maping_status: string;
    project: string;
    status: string;
    support: string;
    updated: string;
    updatedBy: string;

    user: string;
}

export interface Expand {
    user: UserItem;
    asigned_to?: UserItem;
    support?: UserItem;
    updatedBy?: UserItem;
    project?: ProjectItem
}
