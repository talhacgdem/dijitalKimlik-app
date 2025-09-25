export const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
};

export const isValidTCKN = (tckn: string): boolean => {
    if (tckn.length !== 11) return false;
    if (tckn[0] === '0') return false;

    const digits = tckn.split('').map(Number);

    // İlk 10 hanenin toplamı
    const sum1 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    if (sum1 % 10 !== digits[10]) return false;

    // Tek ve çift pozisyonlar kontrolü
    const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const evenSum = digits[1] + digits[3] + digits[5] + digits[7];

    return ((oddSum * 7) - evenSum) % 10 === digits[9];
};

export const validateIdentityNumber = (value: string): string | undefined => {
    if (!value.trim()) {
        return 'TC Kimlik No zorunludur';
    }
    if (!/^\d+$/.test(value)) {
        return 'TC Kimlik No sadece rakam içermelidir';
    }
    if (value.length !== 11) {
        return 'TC Kimlik No 11 hane olmalıdır';
    }
    if (!isValidTCKN(value)) {
        return 'Geçersiz TC Kimlik No';
    }
    return undefined;
};

export const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
        return 'E-posta adresi zorunludur';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        return 'Geçerli bir e-posta adresi giriniz';
    }

    // Daha detaylı validasyon için
    if (value.length > 254) {
        return 'E-posta adresi çok uzun';
    }

    // Local part (@ işaretinden önceki kısım) kontrolü
    const localPart = value.split('@')[0];
    if (localPart.length > 64) {
        return 'E-posta adresinin kullanıcı kısmı çok uzun';
    }

    return undefined;
};


export const validatePassword = (value: string): string | undefined => {
    if (!value.trim()) {
        return 'Şifre zorunludur';
    }
    if (value.length < 6) {
        return 'Şifre en az 6 karakter olmalıdır';
    }
    return undefined;
};