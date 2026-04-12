import EmergencyContact from "../models/emergencyContact.model.js";

export const addContact = async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!phone) missingFields.push("phone");
    if (!relationship) missingFields.push("relationship");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const contact = await EmergencyContact.create({
      name,
      phone,
      relationship,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(500).json({
        success: false,
        message: "Failed to create contact",
      });
    }

    return res.status(201).json({
      success: true,
      data: contact,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.user._id,
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await EmergencyContact.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};