import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  email: string;
  full_name: string;
  id: number | string;
  wallet_balance: number;
}
const initialState: IUser = {
  email: "",
  full_name: "",
  id: "",
  wallet_balance: 0,
};

// Redux slice for user management
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer to add multiple users (keyed by their ID)
    addusers: (state, action: PayloadAction<IUser>) => {
      console.log("Adding users:", action.payload);

      state = { ...state, ...action.payload };

      return state;
    },
  },
});

// Exporting actions
export const { addusers } = userSlice.actions;

// Exporting reducer to use in the store
export default userSlice.reducer;
