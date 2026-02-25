const {UploadClient}=require('@uploadcare/upload-client')

const client=new UploadClient({
    publicKey:process.env.UPLOADCARE_PUBLIC_KEY
})

module.exports = client;