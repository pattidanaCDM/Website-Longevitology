interface Props {
    className?: string;
}

export default function ApplicationLogo({ className }: Props) {
    return (
        <img
            src="/image/Logo-Longevitology.png"
            alt="Logo"
            className={className}
        />
    );
}
