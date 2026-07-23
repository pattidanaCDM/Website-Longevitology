import { ReactNode, PropsWithChildren } from 'react';
import ImageSlideshow from '@/Components/ImageSlideshow';

export default function Guest({ children, header, fullWidth = false }: PropsWithChildren<{ header?: ReactNode, fullWidth?: boolean }>) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-950 transition-colors duration-300">
            {header}

            {/* Container putih full page */}
            <div className={`flex-1 w-full ${fullWidth ? '' : 'px-6 py-6 bg-white dark:bg-slate-900 shadow-md sm:rounded-none'}`}>
                {children}
            </div>
        </div>
    );
}
