export const truncateContent = (content: string, maxLength: number = 80) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
};

export const isValidTCKN = (tckn: string): boolean => {
    return true;
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