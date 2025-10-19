import mongoose from "mongoose";

const BookingItemSchema = new mongoose.Schema(
  {
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },
    timeSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const BookingSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    //   index: true,
    // },
     user: {
    type: String, // sebelumnya ObjectId
    required: true,
  },
    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },
    // Array of court & timeslot combinations
    items: {
      type: [BookingItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "At least one booking item is required",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    // Payment fields
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "bank_transfer", "e_wallet", "cash"],
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    // Additional info
    notes: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk query cepat
BookingSchema.index({ user: 1, bookingDate: 1 });
BookingSchema.index({ bookingDate: 1, status: 1 });

// Method untuk check duplicate booking
BookingSchema.statics.checkDuplicate = async function (bookingDate, items) {
  const promises = items.map(async (item) => {
    const existing = await this.findOne({
      bookingDate,
      "items.court": item.court,
      "items.timeSlot": item.timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return {
        isDuplicate: true,
        court: item.court,
        timeSlot: item.timeSlot,
      };
    }
    return { isDuplicate: false };
  });

  const results = await Promise.all(promises);
  const duplicates = results.filter((r) => r.isDuplicate);

  return {
    hasDuplicate: duplicates.length > 0,
    duplicates,
  };
};

// Pre-save hook untuk update User.reservations
BookingSchema.post("save", async function (doc) {
  try {
    const User = mongoose.model("User");

    // Add booking ID to user's reservations
    await User.findByIdAndUpdate(doc.user, {
      $addToSet: {
        [`reservations.${doc._id}`]: {
          bookingId: doc._id,
          date: doc.bookingDate,
          status: doc.status,
          totalPrice: doc.totalPrice,
          itemsCount: doc.items.length,
          createdAt: doc.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user reservations:", error);
  }
});

// Pre-update hook untuk sync dengan User.reservations
BookingSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;

  try {
    const User = mongoose.model("User");

    // Update booking info in user's reservations
    await User.findByIdAndUpdate(doc.user, {
      $set: {
        [`reservations.${doc._id}`]: {
          bookingId: doc._id,
          date: doc.bookingDate,
          status: doc.status,
          totalPrice: doc.totalPrice,
          itemsCount: doc.items.length,
          updatedAt: doc.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Error updating user reservations:", error);
  }
});

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
