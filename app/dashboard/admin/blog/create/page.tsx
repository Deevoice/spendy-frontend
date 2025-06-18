'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import '@/styles/admin.css';

export default function CreateBlogPost() {
    const { t } = useLanguage();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            const response = await fetch('/api/admin/blog/posts', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                router.push('/dashboard/admin');
            } else {
                throw new Error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert(t('error_creating_post'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="create-post">
            <h1>{t('create_new_post')}</h1>

            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">{t('post_title')}</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">{t('post_content')}</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={10}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">{t('post_image')}</label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="button secondary"
                        onClick={() => router.back()}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        className="button primary"
                        disabled={isLoading}
                    >
                        {isLoading ? t('publishing') : t('publish')}
                    </button>
                </div>
            </form>
        </div>
    );
} 