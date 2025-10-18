// get profile user

export const getUserProfile = (req, res) => {
  try {     
    const role = req.user.role;
    const reservations = req.user.reservations;
    res.json({ success: true, role, reservations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
