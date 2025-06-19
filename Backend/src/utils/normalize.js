import { ValidationError } from "../errors/TypeError.js";

export const normalizeRut = (rut) => {
  if (typeof rut !== "string") {
    throw new ValidationError("RUT inválido", rut);
  }
  return rut.replace(/\s+/g, "").toLowerCase().replace(/[^0-9kK]/g, "");
};

export const normalizeEmail = (email) => {
  if (typeof email !== "string") {
    throw new ValidationError("Email inválido", email);
  }
  return email.trim().toLowerCase();
};
