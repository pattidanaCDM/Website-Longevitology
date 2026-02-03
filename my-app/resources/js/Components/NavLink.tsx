import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-[#ad2c90] text-[#ad2c90] focus:border-[#ad2c90]'
                    : 'border-transparent text-gray-500 hover:border-[#ad2c90] hover:text-[#ad2c90] focus:border-[#ad2c90] focus:text-[#ad2c90]') +
                className
            }
        >
            {children}
        </Link>
    );
}
