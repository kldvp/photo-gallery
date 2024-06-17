export const S3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // Your desired AWS region
  bucketName: process.env.AWS_S3_BUCKET_NAME, // Name of your S3 bucket
  user: process.env.DATABASE_USER,
};
