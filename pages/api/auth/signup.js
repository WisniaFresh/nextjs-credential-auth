import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "Invalid input - wrong email value" });
      client.close();
      return;
    }

    if (!password || password.trim().length < 7) {
      res.status(422).json({
        message: "Invalid input - password must be at least 7 characters long",
      });
      client.close();
      return;
    }

    const client = await connectToDatabase();
    const db = client.db();

    const isUserAlreadyExisting = await db
      .collection("users")
      .findOne({ email });

    if (isUserAlreadyExisting) {
      res.status(422).json({
        message: "User already exists",
      });
      client.close();
      return;
    }

    const hashedPassword = await hashPassword(password);

    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Created user!" });
    client.close();
  }
}

export default handler;
