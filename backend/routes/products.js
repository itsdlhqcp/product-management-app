router.get('/products/search/:query', async (req, res) => {
    try {
      const { query } = req.params;
      const searchRegex = new RegExp(query, 'i'); // Case-insensitive search
      
      const products = await Product.find({
        title: { $regex: searchRegex }
      }).populate({
        path: 'subCategoryId',
        populate: {
          path: 'categoryId'
        }
      });
      
      res.json({ products });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ msg: 'Server error during search' });
    }
  });