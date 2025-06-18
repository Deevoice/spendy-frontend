import { useEffect, useRef } from 'react';
import '@/styles/modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-backdrop" aria-hidden="true" />
            <div className="modal-container">
                <div className="modal-panel" ref={modalRef}>
                    <div className="modal-header">
                        <h2 className="modal-title">{title}</h2>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
} 