import { redirect } from "next/dist/server/api-utils";
import AuthForm from "../components/auth/auth-form";
import { getSession } from "next-auth/react";

function AuthPage() {
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  console.log("session", session);

  if (session) {
    return {
      redirect: {
        destination: "/profile",
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default AuthPage;
