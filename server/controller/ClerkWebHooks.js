import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    console.log("=== WEBHOOK TRIGGERED ===");

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Body adalah Buffer, convert ke string
    const payload = req.body.toString();

    // Verify webhook signature
    await whook.verify(payload, headers);

    // Parse JSON setelah verify
    const { data, type } = JSON.parse(payload);

    console.log("Event type:", type);
    console.log("User ID:", data.id);

    // Switch cases for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          username: (data.first_name || "") + " " + (data.last_name || ""),
          image: data.image_url,
        };

        await User.create(userData);
        console.log("✅ User created:", userData._id);
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          username: (data.first_name || "") + " " + (data.last_name || ""),
          image: data.image_url,
        };

        const updatedUser = await User.findByIdAndUpdate(data.id, userData, {
          new: true,
        });

        if (updatedUser) {
          console.log("✅ User updated:", data.id);
        } else {
          console.log("⚠️ User not found for update, creating new:", data.id);
          // Jika user tidak ada, create baru
          await User.create({ _id: data.id, ...userData });
        }
        break;
      }

      case "user.deleted": {
        const deletedUser = await User.findByIdAndDelete(data.id);

        if (deletedUser) {
          console.log("✅ User deleted:", data.id);
        } else {
          console.log(
            "⚠️ User not found for deletion (already deleted or never created):",
            data.id
          );
        }
        break;
      }

      default:
        console.log("⚠️ Unhandled event type:", type);
        break;
    }

    // Selalu return success agar Clerk tidak retry
    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook error:", error.message);

    // Jika signature verification gagal, return 401
    if (error.message.includes("signature")) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid signature" });
    }

    // Error lainnya, return 400
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
