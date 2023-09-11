import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Every routes children to dashboard will be wrapped in this layout and the auth will be applied e.g. /dashboard/edit etc.
  const session = await getServerSession(authOptions);
  if (session) console.log(session.user);
  else redirect("api/auth/signin");
  return (
    <div className="">
      {/* <Header /> */}
      <div className="max-w-5xl m-auto w-full px-4">{children}</div>
    </div>
  );
}
