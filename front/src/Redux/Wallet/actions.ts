import { Actions } from "./constants";

export const setWallet = (address: string) => ({
  type: Actions.SET_ADDRESS,
  address
});
