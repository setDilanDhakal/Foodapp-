import { unlink } from 'node:fs/promises'
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const UploadOnCloadinary = async (filePath) => {
    try {
        const result = await cloudinary.v2.uploader.upload(filePath, {
            resource_type: 'auto',
        })

        await unlink(filePath)
        return result.secure_url
    } catch (error) {
        try {
            await unlink(filePath)
        } catch {
            // The upload may have failed before a temporary file was created.
        }

        throw error
    }
}

export { UploadOnCloadinary }