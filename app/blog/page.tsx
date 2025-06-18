'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import '@/styles/blog.css';

type BlogPost = {
    id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
};

export default function Blog() {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="loading">{t('loading')}</div>;
    }

    return (
        <div className="blog-page">
            <h1>{t('blog_title')}</h1>

            <div className="blog-grid">
                {posts.map((post) => (
                    <article key={post.id} className="blog-post">
                        {post.image && (
                            <div className="post-image">
                                <img src={post.image} alt={post.title} />
                            </div>
                        )}
                        <div className="post-content">
                            <h2>{post.title}</h2>
                            <p className="post-date">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <p className="post-excerpt">
                                {post.content.substring(0, 200)}...
                            </p>
                            <Link href={`/blog/${post.id}`} className="read-more">
                                {t('read_more')}
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
} 