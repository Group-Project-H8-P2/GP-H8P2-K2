const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer');
const uploadcare = require('../helpers/uploadcare');

router.post('/', multer.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        
        const result = await uploadcare.uploadFile(req.file.buffer,);
        console.log(result);
        
        const imageUrl=`https://383xd3ly0h.ucarecd.net/${result.uuid}/-/preview/539x366/`
        console.log(imageUrl);
        

        res.json({ imageUrl });
    }   catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;



