import React, { createContext, Context } from 'react';

interface ConfigProviderProps {
  prefixCls?: string;
}

export interface ConfigConsumerProps {
  getPrefixCls: (suffixCls: string) => string;
}

export const defaultPrefixCls = 'ty';

export const ConfigContext: Context<ConfigConsumerProps> = createContext({
  getPrefixCls: (suffixCls: string) => `${defaultPrefixCls}-${suffixCls}`,
});

const ConfigProvider: React.FunctionComponent<ConfigProviderProps> = props => {
  const getPrefixCls = (suffixCls: string) => {
    const { prefixCls = defaultPrefixCls } = props;
    return `${prefixCls}-${suffixCls}`;
  };
  const config: ConfigConsumerProps = {
    getPrefixCls,
  };
  return <ConfigContext.Provider value={config}>{props.children}</ConfigContext.Provider>;
};

export const ConfigConsumer = ConfigContext.Consumer;

export default ConfigProvider;
