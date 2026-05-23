import { DynamicModule, Provider } from '@nestjs/common';
import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface DynamicModuleConfig<TOptions> {
  importsFactory?: (options: TOptions) => DynamicModule[] | undefined;
  providersFactory?: (options: TOptions) => Provider[] | undefined;
  exportProviders?: boolean;
}

interface DynamicModuleFactoryResult<TOptions> {
  BaseModule: ConfigurableModuleClass<TOptions>;
  MODULE_OPTIONS_TOKEN: unknown;
}

type ConfigurableModuleClass<TOptions> = {
  new (...args: never[]): object;
  forRoot(options: TOptions): DynamicModule;
};

export function createDynamicModule<TOptions>(
  config: DynamicModuleConfig<TOptions>,
): DynamicModuleFactoryResult<TOptions> {
  const builder = new ConfigurableModuleBuilder<TOptions>()
    .setClassMethodName('forRoot')
    .build();

  class GeneratedDynamicModule extends builder.ConfigurableModuleClass {
    static forRoot(options: TOptions): DynamicModule {
      if (!options) {
        throw new Error('Options are required when using forRoot()');
      }

      const definition: DynamicModule = super.forRoot(options);

      const dynamicImports = config.importsFactory?.(options) ?? [];
      const dynamicProviders = config.providersFactory?.(options) ?? [];
      const dynamicExports = config.exportProviders ? dynamicProviders : [];

      return {
        ...definition,
        global: definition.global ?? true,
        imports: [...(definition.imports || []), ...dynamicImports],
        providers: [...(definition.providers || []), ...dynamicProviders],
        exports: [...(definition.exports || []), ...dynamicExports],
      };
    }
  }

  return {
    BaseModule: GeneratedDynamicModule,
    MODULE_OPTIONS_TOKEN: builder.MODULE_OPTIONS_TOKEN,
  };
}
