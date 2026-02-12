import {
  usernameClient,
  multiSessionClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "@hackhyre/db/auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  plugins: [
    usernameClient(),
    multiSessionClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
