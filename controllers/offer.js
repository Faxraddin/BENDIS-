export const createOffer = async (req, res) => {
  try {
    return "create Offer";
  } catch (error) {
    return res
      .status(500)
      .send({
        success: false,
        message: "Error in create offer",
        error: error.message,
      });
  }
};
