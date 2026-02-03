import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-[#ad2c90] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#9c2782] focus:outline-none focus:ring-2 focus:ring-[#ad2c90] focus:ring-offset-2 active:bg-[#8b2373] ${disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
