import { Actions } from "./constants";

export const initialState = {
  address: "",
  mnemonic: ""
};

export const walletReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case Actions.SET_ADDRESS:
      return {
        ...state,
        address: action.address
      };
    default:
      return state;
  }
};
