import { Breadcrumb } from "@/components/layout/Breadcrumb";

interface PlaceholderPageProps {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  description?: string;
}

export function PlaceholderPage({ title, breadcrumbs, description }: PlaceholderPageProps) {
  return (
    <div>
      {breadcrumbs ? <Breadcrumb items={breadcrumbs} /> : null}
      <h1 className="text-2xl font-bold text-foreground mb-4">{title}</h1>
      <div className="bg-card rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">Módulo em desenvolvimento</p>
        {description ? <p className="text-sm text-muted-foreground/60 mt-1">{description}</p> : null}
      </div>
    </div>
  );
}
