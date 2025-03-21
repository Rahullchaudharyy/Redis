import type { Collection } from "../../interface/collection";
import type { RewardPayoutType } from "../../interface/rewardPayout";
import { client } from "../actions";

export const getRewardPayout = async (page: number = 1) => {
  const res = await client
    .get("/api/collections/reward_payout/records", {
      page: page,
      expand: "releaseBy",
    })
    .send<Collection<RewardPayoutType>>();
  return res;
};
