import { connectToDatabase } from "../../../lib/db";
import { verifyPassword } from "../../../lib/auth";
import { hashPassword } from "../../../lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getServerSession(req, res, authOptions);
  console.log("session", session);

  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  console.log("session", session);

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  console.log("userEmail", userEmail);
  console.log("oldPass", oldPassword);
  console.log("newPass", newPassword);

  const client = await connectToDatabase();
  const user = await client
    .db()
    .collection("users")
    .findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found!" });
    client.close();
    return;
  }

  const currentPasswordFromDB = user.password;

  const isValidPassword = verifyPassword(oldPassword, currentPasswordFromDB);
  if (!isValidPassword) {
    res.status(422).json({ message: "Wrong input, try again." });
    client.close();
    return;
  }

  const newHashedPassword = await hashPassword(newPassword);
  const result = await client
    .db()
    .collection("users")
    .updateOne({ email: userEmail }, { $set: { password: newHashedPassword } });

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
