# Telig

Sistema web administrativo para operação interna, com foco em ordens de serviço, estoque, consultas e módulos de manutenção.

## Visão geral

- Dashboard com indicadores resumidos.
- Ordens de serviço e consulta detalhada.
- Estoque e módulos operacionais.
- Menu lateral com navegação por áreas do sistema.
- Páginas provisórias para recursos que ainda estão em desenvolvimento.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack Query
- Lucide Icons

## Requisitos

- Node.js 18 ou superior.
- npm.

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

O projeto sobe em `http://localhost:8080`.

## Scripts disponíveis

```bash
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # gera a versão de produção
npm run preview  # visualiza o build localmente
npm run lint     # executa a verificação com ESLint
npm run test     # executa os testes com Vitest
```

## Estrutura do projeto

```text
src/
  components/
    layout/      # header, sidebar, breadcrumbs e layout principal
    ui/          # componentes visuais base
  pages/         # páginas do sistema
  hooks/         # hooks utilitários
  integrations/  # integração com Supabase
  lib/           # utilidades compartilhadas
public/          # arquivos estáticos
supabase/        # configuração local do Supabase
```

## Observações

- O projeto já está com o branding ajustado para Telig.
- Ainda não há favicon configurado.
- Algumas telas usam placeholders enquanto os módulos finais não são concluídos.
