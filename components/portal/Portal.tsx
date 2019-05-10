import React, {
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import PurePortal, { PurePortalProps } from './PurePortal';
import { getNodeFromSelector } from './until';

export interface PortalProps extends Partial<PurePortalProps> {
  visible?: boolean;
  mask?: string;
  className?: string;
  style?: Partial<CSSStyleDeclaration>;
  maskClosable?: boolean;
  closeOnClickOutside?: boolean;
  closeOnESC?: boolean;
  onClose?: (event: KeyboardEvent | TouchEvent | MouseEvent) => void;
}

interface PortalComponent<p> extends React.ForwardRefExoticComponent<p> {
  PurePortal: typeof PurePortal;
}

export interface PortalImperativeHandlers {
  purePortalRef: React.RefObject<PurePortal | undefined>;
}

const Portal = forwardRef<PortalImperativeHandlers, PortalProps>((props, ref) => {
  const {
    mask = 'div',
    selector = 'body',
    visible = true,
    className,
    style,
    children,
    maskClosable = true,
    closeOnClickOutside = true,
    closeOnESC = true,
    onClose,
    ...rest
  } = props;

  const node = useMemo(() => document.createElement(mask), [mask]);
  const parent = useMemo(() => getNodeFromSelector(selector), [selector]);
  const purePortalRef = useRef<PurePortal>(null);

  const contains = useCallback((el: Node) => {
    const purePortal = purePortalRef.current;
    if (!purePortal) {
      return false;
    }
    return purePortal.contains(el);
  }, []);
  useImperativeHandle<PortalImperativeHandlers, PortalImperativeHandlers>(
    ref,
    () => ({
      purePortalRef,
      contains,
    }),
    [],
  );

  useLayoutEffect(() => {
    if (!visible || !parent) {
      return;
    }
    parent.appendChild(node);
    if (className) {
      node.className = className;
    }
    if (style) {
      const cssKeys = Object.keys(style) as Array<keyof CSSStyleDeclaration>;
      if (cssKeys.length) {
        node.style.cssText = cssKeys.map(key => `${key}: ${style[key]}`).join('; ');
      }
    }
    return () => {
      parent.removeChild(node);
    };
  }, [visible, node, parent, style, className]);

  useLayoutEffect(() => {
    if (!visible || !maskClosable) {
      return;
    }
    const { position, top, right, bottom, left } = node.style;
    node.style.position = parent === document.body ? 'fixed' : 'absolute';
    node.style.top = '0';
    node.style.right = '0';
    node.style.bottom = '0';
    node.style.left = '0';
    return () => {
      node.style.position = position;
      node.style.top = top;
      node.style.right = right;
      node.style.bottom = bottom;
      node.style.left = left;
    };
  }, [visible, maskClosable, node]);

  useLayoutEffect(() => {
    if (!visible) {
      return;
    }

    function handleEvent(event: MouseEvent | TouchEvent) {
      if (event.defaultPrevented || !closeOnClickOutside || !visible) {
        return;
      }

      const { target } = event;
      if (!(target instanceof Node) || target === node || !contains(target)) {
        if (onClose) {
          onClose(event);
        }
      }
    }

    let dispose;
    if (closeOnClickOutside) {
      if (maskClosable) {
        node.addEventListener('touchstart', handleEvent);
        node.addEventListener('click', handleEvent);
        dispose = () => {
          node.removeEventListener('touchstart', handleEvent);
          node.removeEventListener('click', handleEvent);
        };
      } else {
        window.addEventListener('touchstart', handleEvent);
        window.addEventListener('click', handleEvent);
        dispose = () => {
          window.removeEventListener('touchstart', handleEvent);
          window.removeEventListener('click', handleEvent);
        };
      }
    }

    return dispose;
  }, [visible, maskClosable, closeOnClickOutside, node]);

  useLayoutEffect(() => {
    if (!visible || !closeOnESC || !onClose) {
      return;
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (!onClose) {
        return;
      }
      // ESC
      if (event.keyCode === 27) {
        onClose(event);
      }
    }

    document.body.addEventListener('keyup', handleKeyUp);
    return () => {
      document.body.removeEventListener('keyup', handleKeyUp);
    };
  }, [visible, closeOnESC, onClose]);

  return visible ? (
    <PurePortal ref={purePortalRef} {...rest} selector={node}>
      {children}
    </PurePortal>
  ) : null;
}) as PortalComponent<PortalProps>;

Portal.PurePortal = PurePortal;
Portal.displayName = 'TychePortal';

export default Portal;
