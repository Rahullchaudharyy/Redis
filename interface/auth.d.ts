export interface AuthUser {
  token: string;
  record: Record;
}

export interface Record {
  id: string;
  collectionId: string;
  collectionName: string;
  username: string;
  verified: boolean;
  emailVisibility: boolean;
  email: string;
  created: string;
  updated: string;
  avatar: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  country: string;
  city: string;
  gender: string;
  socail_state: string;
  dob: string;
  role: string;
  user_type: string;
  compnay: string;
}
