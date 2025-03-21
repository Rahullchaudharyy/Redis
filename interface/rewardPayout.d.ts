export interface RewardPayoutType {
  items: Item[];
}

export interface Item {
  id: string;
  amount: number;
  bankAccountName?: string;
  bankAccountNumber?: string; // Added missing property
  bankHolderName?: string;
  emailID?: string;
  mobileNo?: string;
  status?: string;
  releaseBy?: string;
  created?: string;
  updated?: string;
}
