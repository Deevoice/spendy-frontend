'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import '@/styles/home.css';

export default function Home() {
    const { t } = useLanguage();
    const [openFaqs, setOpenFaqs] = useState<number[]>([]);

    const toggleFaq = (index: number) => {
        setOpenFaqs(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <div className="home">
            <section className="hero">
                <h1>{t('home_title')}</h1>
                <p className="subtitle">
                    {t('home_subtitle')}
                </p>
                <div className="cta-buttons">
                    <Link href="/register" className="button primary">
                        {t('get_started')}
                    </Link>
                    <Link href="/login" className="button secondary">
                        {t('sign_in')}
                    </Link>
                </div>
            </section>

            <section className="features">
                <h2>{t('why_choose')}</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>{t('feature_easy_tracking_title')}</h3>
                        <p>{t('feature_easy_tracking_desc')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('feature_analytics_title')}</h3>
                        <p>{t('feature_analytics_desc')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('feature_budget_title')}</h3>
                        <p>{t('feature_budget_desc')}</p>
                    </div>
                    <div className="feature-card">
                        <h3>{t('feature_security_title')}</h3>
                        <p>{t('feature_security_desc')}</p>
                    </div>
                </div>
            </section>

            <section className="faq">
                <h2>{t('faq_title')}</h2>
                <div className="faq-list">
                    <div className={`faq-item ${openFaqs.includes(0) ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggleFaq(0)}>
                            <h3>{t('faq_question_1')}</h3>
                            <span className="faq-arrow"></span>
                        </button>
                        <div className="faq-answer">
                            <p>{t('faq_answer_1')}</p>
                        </div>
                    </div>
                    <div className={`faq-item ${openFaqs.includes(1) ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggleFaq(1)}>
                            <h3>{t('faq_question_2')}</h3>
                            <span className="faq-arrow"></span>
                        </button>
                        <div className="faq-answer">
                            <p>{t('faq_answer_2')}</p>
                        </div>
                    </div>
                    <div className={`faq-item ${openFaqs.includes(2) ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggleFaq(2)}>
                            <h3>{t('faq_question_3')}</h3>
                            <span className="faq-arrow"></span>
                        </button>
                        <div className="faq-answer">
                            <p>{t('faq_answer_3')}</p>
                        </div>
                    </div>
                    <div className={`faq-item ${openFaqs.includes(3) ? 'open' : ''}`}>
                        <button className="faq-question" onClick={() => toggleFaq(3)}>
                            <h3>{t('faq_question_4')}</h3>
                            <span className="faq-arrow"></span>
                        </button>
                        <div className="faq-answer">
                            <p>{t('faq_answer_4')}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about">
                <h2>{t('about_title')}</h2>
                <div className="about-content">
                    <div className="about-text">
                        <p>{t('about_description')}</p>
                        <div className="about-stats">
                            <div className="stat-item">
                                <span className="stat-number">10K+</span>
                                <span className="stat-label">{t('about_users')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">24/7</span>
                                <span className="stat-label">{t('about_support')}</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">99.9%</span>
                                <span className="stat-label">{t('about_uptime')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact">
                <h2>{t('contact_title')}</h2>
                <div className="contact-content">
                    <div className="contact-info">
                        <div className="contact-item">
                            <h3>{t('contact_email_title')}</h3>
                            <p>{t('contact_email')}</p>
                        </div>
                        <div className="contact-item">
                            <h3>{t('contact_phone_title')}</h3>
                            <p>{t('contact_phone')}</p>
                        </div>
                        <div className="contact-item">
                            <h3>{t('contact_address_title')}</h3>
                            <p>{t('contact_address')}</p>
                        </div>
                    </div>
                    <div className="contact-form">
                        <form>
                            <div className="form-group">
                                <input type="text" placeholder={t('contact_name_placeholder')} />
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder={t('contact_email_placeholder')} />
                            </div>
                            <div className="form-group">
                                <textarea placeholder={t('contact_message_placeholder')}></textarea>
                            </div>
                            <button type="submit" className="button primary">
                                {t('contact_send')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
