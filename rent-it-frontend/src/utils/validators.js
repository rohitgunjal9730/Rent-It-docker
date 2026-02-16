// Reusable validation helpers used across forms
export const isRequired = (value) => value !== undefined && value !== null && String(value).trim() !== "";

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isStrongPassword = (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

export const phoneIsValid = (value) => /^[7-9]\d{9}$/.test(value);

// Vehicle Number: common Indian registration formats like MH12AB1234 or KA05MC1234
export const vehicleNumberIsValid = (value) => /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/i.test(value);

// RC Number: allow alphanumeric, 6-12 chars
export const rcNumberIsValid = (value) => /^[A-Z0-9]{6,12}$/i.test(value);

export const aadharIsValid = (value) => /^\d{12}$/.test(value);
export const panIsValid = (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);

export const fileIsImageType = (file) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  return allowed.includes(file.type);
};

export const fileSizeUnder = (file, maxBytes) => file.size <= maxBytes;

// Date helpers
export const isBefore = (start, end) => start && end && start.getTime() < end.getTime();
export const isPast = (date) => date && (new Date(date.toDateString()) < new Date(new Date().toDateString()));

// generate inclusive date array
export const datesBetween = (start, end) => {
  const dates = [];
  if (!start || !end) return dates;
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  while (cur <= last) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
};
