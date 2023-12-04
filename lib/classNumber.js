export function getNumberOfClass(admissionDate) {
    const admissionYear = new Date(admissionDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const isAfterSeptember1 = new Date().getMonth() >= 8;
    return currentYear - admissionYear + (isAfterSeptember1 ? 1 : 0);
}