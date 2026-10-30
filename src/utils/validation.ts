export const validatePhone = (phone: string): boolean => {
  return /^03\d{2}-\d{7}$/.test(phone);
};

export const validateCNIC = (cnic: string): boolean => {
  return /^\d{13}$/.test(cnic.replace(/-/g, ''));
};
