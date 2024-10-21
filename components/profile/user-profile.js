import { useEffect } from "react";
import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";
// import { useSession } from "next-auth/react";

function UserProfile() {
  // const { data: session, status } = useSession();

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     window.location.href = "/auth";
  //   }
  // }, [status]);

  // if (status === "loading") {
  //   console.log("loading");
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
