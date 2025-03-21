import type { UserItem } from "./user";


export interface AcademicRequestsItem {
    academic: Academic;
    applicationData: ApplicationData;
    collectionId: string;
    collectionName: string;
    created: string;
    id: string;
    status: string;
    updateBy: string;
    updated: string;
    expand?: {
        updateBy?: UserItem;
    };
}

export interface Academic {
    amount: number;
    name: string;
    documentId: string;
    applications: number;
    maxParticipents: number;
    pricing: string;
    time: string;
    title: string;
    startDate: string;
    slug: string;
    registerationEndDate: string;
    locationType: string;
    endDate: string;
    languge: string;
    location: string;
    __typename: string;
}

export interface ApplicationData {
    participants: Participant[];
    parent: Parent;
    message: string;
    participantQuestion: string;
}

export interface Participant {
    firstName: string;
    lastName: string;
    gender: string;
    dob: string;
    email: string;
    school: string;
    grade: string;
    tshirtSize: string;
}

export interface Parent {
    title: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
}
