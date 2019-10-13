import wrapWithProvider from "./wrap-with-provider";

wrapWithProvider.componentDidCatch = (error, errorInfo) => {
  if (typeof window !== "undefined") {
    window.Sentry.configureScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
    });
    window.Sentry.captureException(error);
  }
};

export const wrapRootElement = wrapWithProvider;
