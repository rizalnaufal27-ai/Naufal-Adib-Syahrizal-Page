import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'id'],
    defaultLocale: 'en',
    pathnames: {
        '/': '/',
        '/track': '/track',
        '/public/dashboard': {
            en: '/public/dashboard',
            id: '/public/dashboard'
        },
        '/admin': '/admin'
    }
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
