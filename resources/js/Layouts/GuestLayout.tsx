import { ReactNode, PropsWithChildren } from 'react';
import ImageSlideshow from '@/Components/ImageSlideshow';

export default function Guest({ children, header, fullWidth = false, slideshowImages = [] }: PropsWithChildren<{ header?: ReactNode, fullWidth?: boolean, slideshowImages?: string[] }>) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-white dark:bg-slate-950 transition-colors duration-300">
            {header}
            {/* Slideshow di atas */}
            <div className={`pt-10 mb-10 w-full px-6 ${fullWidth ? 'max-w-7xl' : 'max-w-4xl'}`}>
                <ImageSlideshow
                    images={slideshowImages.length > 0 ? slideshowImages : ['/image/slideshow1.png']}
                    className="aspect-video w-full shadow-lg"
                />
            </div>

            {/* Container putih full page */}
            <div className={`flex-1 w-full ${fullWidth ? '' : 'px-6 py-6 bg-white dark:bg-slate-900 shadow-md sm:rounded-none'}`}>
                {children}
            </div>
        </div>
    );
}
