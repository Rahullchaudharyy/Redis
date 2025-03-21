import { UserItem } from "@/interfaces/user";

export interface FSLPItem {
  application: Application;
  collectionId: string;
  collectionName: string;
  created: string;
  cv: string;
  expand?: Expand;
  id: string;
  pic: string;
  status: string;
  updateBy: string;
  updated: string;
  user: string;
  review_note: string;
}

export interface Application {
  address: string;
  city: string;
  country: string;
  dob: string;
  eduState: string;
  emailID: string;
  firstName: string;
  gender: string;
  lastName: string;
  mobileNo: string;
  nationality: string;
  postCode: string;
  sortBreif: string;
  universityName: string;
}

export interface Expand {
  updateBy?: UserItem;
  user?: UserItem;
}
