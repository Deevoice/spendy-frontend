'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
    ru: {
        // Общие
        'save': 'Сохранить',
        'cancel': 'Отмена',
        'error': 'Ошибка',
        'success': 'Успешно',

        // Настройки
        'settings': 'Настройки',
        'language': 'Язык',
        'theme': 'Тема',
        'light': 'Светлая',
        'dark': 'Темная',
        'system': 'Системная',

        // Профиль
        'profile': 'Профиль',
        'name': 'Имя',
        'email': 'Email',
        'change_password': 'Изменить пароль',
        'current_password': 'Текущий пароль',
        'new_password': 'Новый пароль',
        'confirm_password': 'Подтвердите новый пароль',
        'password_changed': 'Пароль успешно изменен',
        'password_error': 'Ошибка при смене пароля',
        'password_mismatch': 'Пароли не совпадают',
        'password_short': 'Пароль должен содержать минимум 8 символов',
        'password_required': 'Все поля должны быть заполнены',
        'logout': 'Выйти из аккаунта',

        // Валидация
        'required_field': 'Обязательное поле',
        'invalid_email': 'Некорректный email',

        // Главная страница
        'home_title': 'Возьмите контроль над финансами',
        'home_subtitle': 'Отслеживайте расходы, управляйте бюджетом и достигайте финансовых целей с Spendy',
        'get_started': 'Начать',
        'sign_in': 'Войти',
        'why_choose': 'Почему Spendy?',
        'feature_easy_tracking_title': 'Простой учет',
        'feature_easy_tracking_desc': 'Быстро добавляйте и категоризируйте транзакции с помощью простого интерфейса',
        'feature_analytics_title': 'Умная аналитика',
        'feature_analytics_desc': 'Получайте аналитику по вашим расходам с помощью красивых графиков и отчетов',
        'feature_budget_title': 'Планирование бюджета',
        'feature_budget_desc': 'Устанавливайте бюджеты и получайте уведомления при приближении к лимитам',
        'feature_security_title': 'Безопасность и конфиденциальность',
        'feature_security_desc': 'Ваши финансовые данные зашифрованы и надежно хранятся',

        // FAQ
        'faq_title': 'Часто задаваемые вопросы',
        'faq_question_1': 'Как начать использовать Spendy?',
        'faq_answer_1': 'Просто зарегистрируйтесь, создайте аккаунт и начните отслеживать свои расходы. Наш интуитивно понятный интерфейс поможет вам быстро освоиться.',
        'faq_question_2': 'Безопасны ли мои данные?',
        'faq_answer_2': 'Да, мы используем современные методы шифрования и безопасного хранения данных. Ваша финансовая информация надежно защищена.',
        'faq_question_3': 'Можно ли использовать Spendy на мобильных устройствах?',
        'faq_answer_3': 'Да, Spendy полностью адаптирован для использования на любых устройствах - от смартфонов до планшетов и компьютеров.',
        'faq_question_4': 'Как работает система уведомлений?',
        'faq_answer_4': 'Вы можете настроить уведомления о превышении бюджета, регулярных платежах и важных финансовых событиях. Все настройки доступны в вашем профиле.',

        // About Us
        'about_title': 'О нас',
        'about_description': 'Spendy - это современный финансовый менеджер, созданный для того, чтобы помочь людям лучше управлять своими финансами. Мы стремимся сделать финансовое планирование простым и доступным для каждого.',
        'about_users': 'Активных пользователей',
        'about_support': 'Поддержка',
        'about_uptime': 'Доступность сервиса',

        // Contact
        'contact_title': 'Свяжитесь с нами',
        'contact_email_title': 'Email',
        'contact_email': 'support@spendy.com',
        'contact_phone_title': 'Телефон',
        'contact_phone': '+7 (999) 123-45-67',
        'contact_address_title': 'Адрес',
        'contact_address': 'г. Москва, ул. Примерная, д. 123',
        'contact_name_placeholder': 'Ваше имя',
        'contact_email_placeholder': 'Ваш email',
        'contact_message_placeholder': 'Ваше сообщение',
        'contact_send': 'Отправить сообщение',

        // Admin Dashboard
        'admin_dashboard': 'Панель администратора',
        'time_range_day': 'День',
        'time_range_week': 'Неделя',
        'time_range_month': 'Месяц',
        'time_range_year': 'Год',
        'time_range_custom': 'Произвольный период',
        'to': 'до',
        'total_users': 'Всего пользователей',
        'total_visits': 'Всего посещений',
        'total_transactions': 'Всего транзакций',
        'visits_by_country': 'Посещения по странам',
        'blog_management': 'Управление блогом',
        'create_new_post': 'Создать новую запись',
        'loading': 'Загрузка...',

        // Blog
        'blog_title': 'Блог',
        'post_title': 'Заголовок',
        'post_content': 'Содержание',
        'post_image': 'Изображение',
        'publish': 'Опубликовать',
        'publishing': 'Публикация...',
        'cancel': 'Отмена',
        'error_creating_post': 'Ошибка при создании записи',
        'read_more': 'Читать далее',
        admin_unauthorized: 'Требуется вход администратора',
    },
    en: {
        // Common
        'save': 'Save',
        'cancel': 'Cancel',
        'error': 'Error',
        'success': 'Success',

        // Settings
        'settings': 'Settings',
        'language': 'Language',
        'theme': 'Theme',
        'light': 'Light',
        'dark': 'Dark',
        'system': 'System',

        // Profile
        'profile': 'Profile',
        'name': 'Name',
        'email': 'Email',
        'change_password': 'Change Password',
        'current_password': 'Current Password',
        'new_password': 'New Password',
        'confirm_password': 'Confirm New Password',
        'password_changed': 'Password successfully changed',
        'password_error': 'Error changing password',
        'password_mismatch': 'Passwords do not match',
        'password_short': 'Password must be at least 8 characters',
        'password_required': 'All fields are required',
        'logout': 'Logout',

        // Validation
        'required_field': 'Required field',
        'invalid_email': 'Invalid email',

        // Home page
        'home_title': 'Take Control of Your Finances',
        'home_subtitle': 'Track your expenses, manage your budget, and achieve your financial goals with Spendy',
        'get_started': 'Get Started',
        'sign_in': 'Sign In',
        'why_choose': 'Why Choose Spendy?',
        'feature_easy_tracking_title': 'Easy Tracking',
        'feature_easy_tracking_desc': 'Quickly add and categorize your transactions with a simple interface',
        'feature_analytics_title': 'Smart Analytics',
        'feature_analytics_desc': 'Get insights into your spending patterns with beautiful charts and reports',
        'feature_budget_title': 'Budget Planning',
        'feature_budget_desc': 'Set budgets and get alerts when you\'re approaching your limits',
        'feature_security_title': 'Secure & Private',
        'feature_security_desc': 'Your financial data is encrypted and stored securely',

        // FAQ
        'faq_title': 'Frequently Asked Questions',
        'faq_question_1': 'How do I get started with Spendy?',
        'faq_answer_1': 'Simply register, create an account, and start tracking your expenses. Our intuitive interface will help you get started quickly.',
        'faq_question_2': 'Is my data secure?',
        'faq_answer_2': 'Yes, we use modern encryption methods and secure data storage. Your financial information is well protected.',
        'faq_question_3': 'Can I use Spendy on mobile devices?',
        'faq_answer_3': 'Yes, Spendy is fully responsive and works great on any device - from smartphones to tablets and computers.',
        'faq_question_4': 'How does the notification system work?',
        'faq_answer_4': 'You can set up notifications for budget overruns, regular payments, and important financial events. All settings are available in your profile.',

        // About Us
        'about_title': 'About Us',
        'about_description': 'Spendy is a modern financial manager created to help people better manage their finances. We strive to make financial planning simple and accessible for everyone.',
        'about_users': 'Active Users',
        'about_support': 'Support',
        'about_uptime': 'Service Uptime',

        // Contact
        'contact_title': 'Contact Us',
        'contact_email_title': 'Email',
        'contact_email': 'support@spendy.com',
        'contact_phone_title': 'Phone',
        'contact_phone': '+1 (555) 123-4567',
        'contact_address_title': 'Address',
        'contact_address': '123 Example St, New York, NY 10001',
        'contact_name_placeholder': 'Your Name',
        'contact_email_placeholder': 'Your Email',
        'contact_message_placeholder': 'Your Message',
        'contact_send': 'Send Message',

        // Admin Dashboard
        'admin_dashboard': 'Admin Dashboard',
        'time_range_day': 'Day',
        'time_range_week': 'Week',
        'time_range_month': 'Month',
        'time_range_year': 'Year',
        'time_range_custom': 'Custom Range',
        'to': 'to',
        'total_users': 'Total Users',
        'total_visits': 'Total Visits',
        'total_transactions': 'Total Transactions',
        'visits_by_country': 'Visits by Country',
        'blog_management': 'Blog Management',
        'create_new_post': 'Create New Post',
        'loading': 'Loading...',

        // Blog
        'blog_title': 'Blog',
        'post_title': 'Title',
        'post_content': 'Content',
        'post_image': 'Image',
        'publish': 'Publish',
        'publishing': 'Publishing...',
        'cancel': 'Cancel',
        'error_creating_post': 'Error creating post',
        'read_more': 'Read More',
        admin_unauthorized: 'Admin login required',
    },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ru');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 