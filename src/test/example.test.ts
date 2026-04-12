import { describe, it, expect } from "vitest";
import { validarCPF, validarCNPJ, maskCPF, maskCNPJ } from "@/lib/cpf";

describe("document validators", () => {
  it("validates CPF numbers", () => {
    expect(validarCPF("111.444.777-35")).toBe(true);
    expect(validarCPF("111.111.111-11")).toBe(false);
    expect(maskCPF("11144477735")).toBe("111.444.777-35");
  });

  it("validates CNPJ numbers", () => {
    expect(validarCNPJ("04.252.011/0001-10")).toBe(true);
    expect(validarCNPJ("11.111.111/1111-11")).toBe(false);
    expect(maskCNPJ("04252011000110")).toBe("04.252.011/0001-10");
  });
});
