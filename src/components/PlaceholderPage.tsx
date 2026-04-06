import { Breadcrumb } from "@/components/layout/Breadcrumb";

interface PlaceholderPageProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PlaceholderPage({ title, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div>
      <Breadcrumb items={breadcrumbs} />
      <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
      <div className="bg-card rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">Módulo em desenvolvimento</p>
        <p className="text-sm text-muted-foreground/60 mt-1">
          Esta funcionalidade será implementada nas próximas iterações.
        </p>
      </div>
    </div>
  );
}
