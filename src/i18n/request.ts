import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    // ensure that the incoming locale is valid
    if (!locale || !['en', 'id'].includes(locale)) {
        locale = 'en';
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
