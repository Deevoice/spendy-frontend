interface ProgressBarProps {
    progress: number;
    color?: string;
}

export function ProgressBar({ progress, color = 'var(--primary)' }: ProgressBarProps) {
    return (
        <div className="progress-bar">
            <div
                className="progress-bar-fill"
                style={{
                    width: `${progress}%`,
                    backgroundColor: color
                }}
            />
        </div>
    );
} 