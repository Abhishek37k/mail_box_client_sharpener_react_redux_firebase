import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import mailReducer from "./mail-slice";

const store = configureStore({
  reducer: { auth: authReducer,
    mail: mailReducer
   },
});

export default store;
