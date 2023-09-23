'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DisplayImageProps } from '@/types/user'

export default function DisplayImage({ id, image, name, session }: DisplayImageProps) {
    const router = useRouter()
    const [imgFile, setImgFile] = useState<File | string>()
    const [imgUploading, setImgUploading] = useState(false)
    const [buttonChange, setButtonChange] = useState(false)

    function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return
        setImgFile(event.target.files[0])
        setButtonChange(true)
    }

    function cancelImage() {
        setImgFile('')
        setButtonChange(false)
    }

    async function uploadImageCloudinary() {
        setImgUploading(true)
        const formData = new FormData();
        formData.append("imgFile", imgFile as string)
        formData.append("id", id)
        const cloudinary = await fetch('/api/user/cloudinary', {
            method: 'POST',
            body: formData
        })
        if (cloudinary.ok) setButtonChange(false)
        setImgUploading(() => false)
        router.refresh()
    }

    return (
        <div className="flex flex-col mb-6">
            <div className="avatar">
                <div className={`w-64 rounded-full mx-auto ring hover:ring-primary ${buttonChange ? 'ring-warning' : ''}`}>
                    {session ? (<>
                        <label htmlFor='fileImage' className='cursor-pointer'>
                            <Image src={imgFile ? URL.createObjectURL(imgFile as File) : image} alt={name as string} height={500} width={500} key={imgFile as string} priority />
                        </label>
                        <input type='file' className='hidden' id='fileImage' onChange={handleImage} key={imgFile as string || ''} accept='image/png, image/jpeg' />
                    </>) : (
                        <Image src={imgFile ? URL.createObjectURL(imgFile as File) : image} alt={name as string} height={500} width={500} key={imgFile as string} priority />
                    )}
                </div>
            </div>
            {buttonChange && (<>
                <div className='flex mx-auto space-x-4 p-4'>
                    <button className='btn btn-neutral' onClick={cancelImage} disabled={imgUploading}>Cancel</button>
                    <button className='btn btn-primary' onClick={uploadImageCloudinary} disabled={imgUploading}>
                        {imgUploading && (<>
                            <span className='loading loading-spinner'></span>
                        </>)}
                        Confirm</button>
                </div>
            </>)}
        </div>)
}