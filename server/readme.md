// User bisa booking multiple items
POST /api/booking
Body: {
bookingDate: "2025-01-25",
items: [
{ courtId: "xxx", timeSlotId: "yyy", price: 70000 },
{ courtId: "xxx", timeSlotId: "zzz", price: 70000 }
]
}

// Data booking otomatis masuk ke User.reservations
// Cek di MongoDB:
User {
reservations: {
"booking123": {
bookingId: "booking123",
date: "2025-01-25",
status: "pending",
totalPrice: 140000,
itemsCount: 2
}
}
}
