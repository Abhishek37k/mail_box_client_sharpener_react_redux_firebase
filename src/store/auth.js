import { authActions } from "./auth-slice";
export const signupUser = ({ email, password }) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Signup failed!");
      }

      dispatch(
        authActions.signup({
          token: data.idToken,
          email: data.email,
        })
      );
      console.log("✅ User has successfully signed up");

      return true;
    } catch (error) {
      dispatch(authActions.setError(error.message));
      return false;
    }
  };
};

export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    try {
      // console.log("Firebase API key:", process.env.REACT_APP_FIREBASE_API_KEY);
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Signup failed!");
      }

      dispatch(
        authActions.login({
          token: data.idToken,
          email: data.email,
        })
      );

      console.log("✅ User has successfully logged in");
      return true;
    } catch (error) {
      dispatch(authActions.setError(error.message));
      return false;
    }
  };
};
