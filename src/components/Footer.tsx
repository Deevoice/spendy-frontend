'use client';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} Spendy</p>
                </div>
            </div>
        </footer>
    );
} 