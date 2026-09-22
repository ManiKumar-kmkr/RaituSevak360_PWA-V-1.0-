declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {}
  interface Component<P = {}, S = {}, SS = any> {}
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactNode;
  }
  type FC<P = {}> = FunctionComponent<P>;
  type ButtonHTMLAttributes<T> = any;
  type InputHTMLAttributes<T> = any;
}
