'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Upload, Image as ImageIcon, Video, Trash2, X, Check } from 'lucide-react';

interface MediaItem {
    id: string;
    filename: string;
    path: string;
    type: 'IMAGE' | 'VIDEO';
    size: number;
}

export default function MediaManagementPage() {
    const locale = useLocale();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch('/api/media');
            const data = await response.json();
            setMedia(data.media || []);
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/media', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setMedia(prev => [data.media, ...prev]);
                }
            } catch (error) {
                console.error('Failed to upload file:', error);
            }

            setUploadProgress(((i + 1) / files.length) * 100);
        }

        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(locale === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
            return;
        }

        try {
            await fetch(`/api/media/${id}`, { method: 'DELETE' });
            setMedia(media.filter(m => m.id !== id));
        } catch (error) {
            console.error('Failed to delete media:', error);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">
                        {locale === 'ar' ? 'إدارة الملفات' : 'Media Manager'}
                    </h1>
                    <p className="text-muted">
                        {locale === 'ar' ? 'رفع وإدارة الصور والفيديوهات' : 'Upload and manage images and videos'}
                    </p>
                </div>
            </div>

            {/* Upload Area */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-current/20 rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors mb-8"
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleUpload}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary animate-bounce" />
                        </div>
                        <div className="max-w-xs mx-auto">
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted mt-2">
                                {locale === 'ar' ? 'جاري الرفع...' : 'Uploading...'} {Math.round(uploadProgress)}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium mb-2">
                            {locale === 'ar' ? 'اضغط لرفع الملفات' : 'Click to upload files'}
                        </p>
                        <p className="text-sm text-muted">
                            {locale === 'ar'
                                ? 'صور (JPG, PNG, WebP) أو فيديوهات (MP4, WebM)'
                                : 'Images (JPG, PNG, WebP) or Videos (MP4, WebM)'}
                        </p>
                    </>
                )}
            </div>

            {/* Media Grid */}
            {isLoading ? (
                <div className="text-center py-20">
                    <p className="text-muted">{locale === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-20 bg-secondary rounded-2xl">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <ImageIcon className="w-10 h-10 text-muted" />
                    </div>
                    <p className="text-muted text-lg">
                        {locale === 'ar' ? 'لا توجد ملفات بعد' : 'No media files yet'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="group relative aspect-square bg-secondary rounded-xl overflow-hidden"
                        >
                            {item.type === 'IMAGE' ? (
                                <img
                                    src={item.path}
                                    alt={item.filename}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary">
                                    <Video className="w-12 h-12 text-muted" />
                                </div>
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white text-xs truncate">{item.filename}</p>
                                <p className="text-white/60 text-xs">{formatFileSize(item.size)}</p>
                            </div>

                            {/* Type badge */}
                            <div className="absolute top-2 left-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.type === 'IMAGE' ? 'bg-blue-500' : 'bg-purple-500'
                                    } text-white`}>
                                    {item.type === 'IMAGE'
                                        ? (locale === 'ar' ? 'صورة' : 'Image')
                                        : (locale === 'ar' ? 'فيديو' : 'Video')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
