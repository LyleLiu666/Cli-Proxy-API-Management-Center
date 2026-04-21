import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

type LazyModule = Record<string, unknown>;
type RouteComponent<TModuleValue> =
  TModuleValue extends ComponentType<infer Props> ? ComponentType<Props> : never;
type RouteExportName<TModule extends LazyModule> = Extract<
  {
    [K in keyof TModule]: TModule[K] extends ComponentType<infer _Props> ? K : never;
  }[keyof TModule],
  string
>;

export async function loadNamedRouteExport<
  TModule extends LazyModule,
  TExportName extends RouteExportName<TModule>
>(
  loader: () => Promise<TModule>,
  exportName: TExportName
): Promise<{ default: RouteComponent<TModule[TExportName]> }> {
  const mod = await loader();
  const component = mod[exportName];

  if (!component) {
    throw new Error(`Missing route export: ${exportName}`);
  }

  return { default: component as RouteComponent<TModule[TExportName]> };
}

export function lazyRoute<TModule extends LazyModule, TExportName extends RouteExportName<TModule>>(
  loader: () => Promise<TModule>,
  exportName: TExportName
): LazyExoticComponent<RouteComponent<TModule[TExportName]>> {
  return lazy(() => loadNamedRouteExport(loader, exportName));
}
