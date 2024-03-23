import { OAuth2Client, UserRefreshClient } from "google-auth-library";
import UserModel from "./database/models/user.model";

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export async function verifyGoogleToken(token: string) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const client = new OAuth2Client(GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID,
  });
  return { payload: ticket.getPayload() };
}

// function to check if a access token is valid
export async function checkAccessTokenValidity(
  accessToken: string,
  refreshToken: string,
  user_email: string,
  isRecursivelyCalled = false
) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    );
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(`Error: ${data.error}`);
    }
  } catch (error: any) {
    if (error.message?.includes("invalid_token")) {
      //Refresh the token
      console.log("Refreshing the token");

      const user = new UserRefreshClient(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        refreshToken
      );

      const { credentials } = await user.refreshAccessToken();

      console.log("Token refreshed", credentials);

      const currentUser = await UserModel.findOne({ email: user_email });

      if (currentUser) {
        currentUser.accessToken = credentials.access_token ?? "";
        currentUser.refreshToken = credentials.refresh_token;
        await currentUser.save();

        if (!isRecursivelyCalled) {
          checkAccessTokenValidity(
            credentials.access_token ?? "",
            credentials.refresh_token ?? "",
            user_email,
            true
          );
        }
      }
    } else {
      console.log("Error in checking token validity");
      console.log(error.message.indexOf("invalid_token"));
    }

    handleError(error);
  }
}
