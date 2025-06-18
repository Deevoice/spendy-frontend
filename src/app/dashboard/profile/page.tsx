'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import '@/styles/profile.css';

function validateEmail(email: string) {
    // Простая email-валидация
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, updateUser, logout } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // Состояния для изменения пароля
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Синхронизируем локальные стейты с user
    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setEmail(user.email || '');
            setAvatar(user.avatar || null);
        }
    }, [user]);

    // Отслеживаем изменения в полях
    useEffect(() => {
        if (user) {
            const hasChanges =
                fullName !== (user.full_name || '') ||
                email !== (user.email || '') ||
                avatarFile !== null;
            setIsDirty(hasChanges);
        }
    }, [fullName, email, avatarFile, user]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setError(null);
        setSuccess(null);

        if (!validateEmail(email)) {
            setError('Пожалуйста, введите корректный email');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('full_name', fullName);
            formData.append('email', email);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }

            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/auth/me', {
                method: 'PATCH',
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении профиля');
            }

            const updatedUser = await response.json();
            setSuccess('Профиль успешно обновлен!');
            setAvatar(updatedUser.avatar || null);
            setAvatarFile(null);
            setIsDirty(false);
            // Обновляем пользователя в AuthContext
            updateUser({
                full_name: updatedUser.full_name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
            });
        } catch (e) {
            setError('Ошибка при сохранении профиля');
        }
    };

    const handleCancel = () => {
        if (user) {
            setFullName(user.full_name || '');
            setEmail(user.email || '');
            setAvatar(user.avatar || null);
            setAvatarFile(null);
            setIsDirty(false);
        }
    };

    const handlePasswordChange = async () => {
        setPasswordError(null);
        setPasswordSuccess(null);

        if (newPassword !== confirmPassword) {
            setPasswordError('Пароли не совпадают');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://localhost:8000/api/auth/me/password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при смене пароля');
            }

            setPasswordSuccess('Пароль успешно изменен');
            toast.success('Пароль успешно изменен', {
                duration: 4000,
                position: 'top-right',
                style: {
                    background: '#4CAF50',
                    color: '#fff',
                },
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setIsChangingPassword(false);
        } catch (err) {
            setPasswordError('Ошибка при изменении пароля');
            toast.error('Ошибка при изменении пароля', {
                duration: 4000,
                position: 'top-right',
                style: {
                    background: '#f44336',
                    color: '#fff',
                },
            });
        }
    };

    return (
        <div className="profile-container">
            <button
                className="profile-back-button"
                onClick={() => router.push('/dashboard')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Назад к дашборду
            </button>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="profile-section">
                <div className="profile-header">
                    <div className="profile-avatar-container" onClick={handleAvatarClick}>
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="profile-avatar"
                            />
                        ) : (
                            <div className="profile-avatar">
                                {fullName ? fullName[0].toUpperCase() : '?'}
                            </div>
                        )}
                        <div className="profile-avatar-edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                <path d="m15 5 4 4" />
                            </svg>
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                    />
                    <div className="profile-info">
                        <h1 className="profile-name">{fullName}</h1>
                        <p className="profile-email">{email}</p>
                    </div>
                </div>

                <div className="profile-form">
                    <div className="form-group">
                        <label className="form-label">Имя:</label>
                        <input
                            type="text"
                            className="form-input"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    {isDirty && (
                        <div className="button-group">
                            <button className="btn-secondary" onClick={handleCancel}>
                                Отмена
                            </button>
                            <button className="btn-primary" onClick={handleSave}>
                                Сохранить изменения
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="profile-section">
                <h2 className="profile-section-title">Безопасность</h2>
                {!isChangingPassword ? (
                    <button
                        className="btn-secondary"
                        onClick={() => setIsChangingPassword(true)}
                    >
                        Изменить пароль
                    </button>
                ) : (
                    <div className="profile-form">
                        {passwordError && (
                            <div className="alert alert-error">{passwordError}</div>
                        )}
                        {passwordSuccess && (
                            <div className="alert alert-success">{passwordSuccess}</div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Текущий пароль:</label>
                            <input
                                type="password"
                                className="form-input"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Новый пароль:</label>
                            <input
                                type="password"
                                className="form-input"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Подтвердите пароль:</label>
                            <input
                                type="password"
                                className="form-input"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="button-group">
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setCurrentPassword('');
                                    setNewPassword('');
                                    setConfirmPassword('');
                                    setPasswordError(null);
                                    setPasswordSuccess(null);
                                }}
                            >
                                Отмена
                            </button>
                            <button
                                className="btn-primary"
                                onClick={handlePasswordChange}
                            >
                                Сохранить пароль
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h2 className="profile-section-title">Аккаунт</h2>
                <button className="btn-secondary" onClick={logout}>
                    Выйти из аккаунта
                </button>
            </div>
        </div>
    );
} 