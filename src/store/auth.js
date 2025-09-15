import { authActions } from "./auth-slice";
export const signupUser = ({ email, password }) => {
  return async (dispatch) => {
    try {
      console.log("Firebase API key:", process.env.REACT_APP_FIREBASE_API_KEY);
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
    } catch (error) {
      dispatch(authActions.setError(error.message));
    }
  };
};
