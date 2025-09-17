import { createSlice } from "@reduxjs/toolkit";

const mailSlice = createSlice({
  name: "mail",
  initialState: {
    inbox: [], 
  },
  reducers: {
  
    markAsRead(state, action) {
      const mailId = action.payload;
      const mail = state.inbox.find((m) => m.id === mailId);
      if (mail) {
        mail.read = true;
      }
    },
  },
});

export const mailActions = mailSlice.actions;
export default mailSlice.reducer;
