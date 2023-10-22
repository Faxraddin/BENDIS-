// Search
export const search = async (req, res) => {
  const searchTerm = req.query.q;

  try {
    const searchResults = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    }).exec();

    res.json(searchResults);
  } catch (err) {
    console.error("Error while searching:", err);
    res.status(500).json({ error: "An error occurred while searching." });
  }
};
