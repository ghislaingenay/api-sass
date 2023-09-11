import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Session, getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// Every routes children to dashboard will be wrapped in this layout and the auth will be applied e.g. /dashboard/edit etc.
export const mustBeLoggedIn = async (session: Session | null) => {
  if (!session) redirect("api/auth/signin");
};

export const getAuthSession = async () => {
  const session = await getServerSession(authOptions);
  return session;
};
