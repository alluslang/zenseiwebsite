import React, { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { Upload, X, Crop as CropIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import './ImageUploader.css';

// Helper function to create an image element from a file URL
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

// Helper function to get cropped image 
async function getCroppedImg(imageSrc, pixelCrop, imageType = 'image/jpeg') {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    // set canvas size to match the bounding box
    canvas.width = image.width;
    canvas.height = image.height;

    // draw rotated image
    ctx.translate(image.width / 2, image.height / 2);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw image
    ctx.drawImage(image, 0, 0);

    // cropped canvas
    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
        return null;
    }

    // Set the size of the cropped canvas
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    // Draw the cropped image onto the new canvas
    croppedCtx.drawImage(
        canvas,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // As a blob
    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob((file) => {
            resolve(file);
        }, imageType, 1.0);
    });
}

/**
 * ImageUploader handles selecting an image, cropping it, compressing it, 
 * uploading to Supabase, and returning the public URL.
 * 
 * @param {string} value The current image_url value
 * @param {function} onChange Callback when an image is successfully uploaded (returns URL)
 * @param {number} aspect The aspect ratio for cropping (e.g., 1 for 1:1, 16/9 for 16:9). 
 * @param {string} objectFit How the image should fit the crop area ('cover', 'contain', etc)
 */
export default function ImageUploader({ value, onChange, aspect, guideText, objectFit = 'cover' }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [imageType, setImageType] = useState('image/jpeg');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef(null);

    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageType(file.type || 'image/jpeg');
            let imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl);
            setIsModalOpen(true);
            // Reset input value so same file can be selected again if needed
            e.target.value = '';
        }
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSaveCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setIsProcessing(true);
        const toastId = toast.loading('Processing image...');

        try {
            // 1. Get cropped image blob
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, imageType);

            // 2. Compress image
            toast.loading('Compressing image...', { id: toastId });
            const compressionOptions = {
                maxSizeMB: 0.5, // 500KB max
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                alwaysKeepResolution: true, // Try to maintain logo details
                fileType: imageType // Keep PNG as PNG
            };

            const compressedFile = await imageCompression(new File([croppedImageBlob], `image.${imageType.split('/')[1] || 'jpg'}`, { type: imageType }), compressionOptions);

            // 3. Upload to Supabase Zensei bucket
            toast.loading('Uploading to server...', { id: toastId });
            const fileExt = imageType === 'image/png' ? 'png' : imageType === 'image/webp' ? 'webp' : 'jpg';
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { data, error } = await supabase.storage
                .from('Zensei')
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // 4. Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('Zensei')
                .getPublicUrl(filePath);

            // Return URL to parent
            onChange({ target: { name: 'image_url', value: publicUrl } });

            toast.success('Image uploaded successfully!', { id: toastId });
            setIsModalOpen(false);
            setImageSrc(null);

        } catch (e) {
            console.error(e);
            toast.error(`Upload failed: ${e.message}`, { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="image-uploader-wrapper">
            <div className="image-uploader-preview-area">
                {value ? (
                    <div className="image-preview-container">
                        <img src={value} alt="Preview" className="cms-image-preview" />
                        <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => onChange({ target: { name: 'image_url', value: '' } })}
                            title="Remove Image"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <div
                        className="empty-image-placeholder"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload size={32} color="#aaa" />
                        <p>Click to browse or drop an image</p>
                        {guideText && <span className="upload-guide">{guideText}</span>}
                    </div>
                )}
            </div>

            {!value && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                    <button type="button" className="cms-btn-secondary" onClick={() => fileInputRef.current?.click()}>
                        Select an Image File
                    </button>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {isModalOpen && (
                <div className="crop-modal-overlay">
                    <div className="crop-modal-content">
                        <div className="crop-modal-header">
                            <h3><CropIcon size={18} /> Crop & Adjust Image</h3>
                            <button
                                className="close-modal-btn"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isProcessing}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="crop-container">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={aspect} // if undefined, it allows free cropping
                                objectFit={objectFit}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>

                        <div className="crop-controls">
                            <div className="zoom-slider">
                                <label>Zoom</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(e.target.value)}
                                    disabled={isProcessing}
                                />
                            </div>
                            <button
                                type="button"
                                className="cms-btn-primary crop-save-btn"
                                onClick={handleSaveCrop}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing & Uploading...' : 'Apply & Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
