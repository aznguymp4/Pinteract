const express = require('express');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require("@aws-sdk/credential-providers"); // CommonJS import
const client = new S3Client({
  region: process.env.AWS_S3_BUCKET_REGION,
  credentials: fromEnv()
})

router.get('/sign/:fileName', requireAuth, async(req, res, next) => {
  const { fileName } = req.params
	const [name, ext] = fileName.split(/\.(?=\w{1,}$)/)
  if(!/(png|jpe?g|gif|webp)/.test(ext)) return res.status(400).json({message: 'Extension not allowed. (Must be png, jpg, jpeg, gif, or webp)'})
	
	const Key = `${process.env.SCHEMA}-${req.user.id}-${new Date().getTime()}.${ext}`
	getSignedUrl(client, new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET,
		Key,
		ContentType: 'image/'+ext,
    Metadata: {
      'Content-Type': 'image/'+ext
    }
	}), {expiresIn: 120})
  .then(url => res.json({
		signedUrl: url,
		fileUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_BUCKET_REGION}.amazonaws.com/${Key}`
	}))
  .catch(next)
})

module.exports = router;