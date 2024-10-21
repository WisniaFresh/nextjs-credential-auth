import { useRef } from "react";
import classes from "./profile-form.module.css";

function ProfileForm() {
  const newPasswordField = useRef();
  const oldPasswordField = useRef();

  async function submitHandler(e) {
    e.preventDefault();
    console.log("submit handler");

    const newPassword = newPasswordField.current.value;
    const oldPassword = oldPasswordField.current.value;

    try {
      const result = await fetch("/api/user/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          newPassword,
          oldPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(result.json());
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordField} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordField} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
