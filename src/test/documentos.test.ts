import { describe, expect, it } from "vitest";
import { validarCPF, validarCNPJ } from "@/lib/cpf";

describe("documentos", () => {
  it("rejects invalid CPF values", () => {
    expect(validarCPF("000.000.000-00")).toBe(false);
    expect(validarCPF("123.456.789-00")).toBe(false);
  });

  it("accepts valid CPF values", () => {
    expect(validarCPF("111.444.777-35")).toBe(true);
  });

  it("rejects invalid CNPJ values", () => {
    expect(validarCNPJ("00.000.000/0000-00")).toBe(false);
    expect(validarCNPJ("11.111.111/1111-11")).toBe(false);
  });

  it("accepts valid CNPJ values", () => {
    expect(validarCNPJ("04.252.011/0001-10")).toBe(true);
  });
});
