import React from 'react';
import classNames from 'classnames';
import { svgBaseProps } from './untils';
import createFromIconfont from './IconFont';
import './importSVG';
import './style';

export interface IconProps extends React.DOMAttributes<HTMLElement> {
  name?: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  material?: string;
  spin?: boolean;
  rotate?: number;
}

interface CustomIconComponentProps {
  width: string | number;
  height: string | number;
  fill: string;
  className?: string;
  ['aria-hidden']?: string;
  style?: React.CSSProperties;
}

interface IconComponent<p> extends React.FunctionComponent<p> {
  createFromIconfont: typeof createFromIconfont;
}

const Icon: IconComponent<IconProps> = props => {
  const { className, children, material, type, spin, rotate, style, ...restProps } = props;

  let classString = classNames(
    {
      [`tycheicon`]: true,
    },
    className,
  );

  const svgClassString = classNames({
    [`tycheicon-spin`]: !!spin || type === 'loading',
  });

  let materialStyle;

  const rotateStyle = rotate
    ? {
        transform: `rotate(${rotate}deg)`,
        msTransform: `rotate(${rotate}deg)`,
      }
    : undefined;

  const innerSvgProps: CustomIconComponentProps = {
    ...svgBaseProps,
    className: svgClassString,
    style: rotateStyle,
  };

  let innerNode = null;

  // defalut icons
  if (typeof type === 'string') {
    innerNode = (
      <svg {...innerSvgProps}>
        <use xlinkHref={`#${type}`} />
      </svg>
    );
  }

  // Iconfont
  if (children) {
    innerNode = <svg {...innerSvgProps}>{children}</svg>;
  }

  // Material Design Icons
  if (material) {
    innerNode = material;
    classString = classNames(classString, 'material-icons');
    materialStyle = {
      style: Object.assign({}, props.style, rotateStyle),
    };
  }

  return (
    <i className={classString} {...materialStyle} {...restProps}>
      {innerNode}
    </i>
  );
};

Icon.createFromIconfont = createFromIconfont;

export default Icon;
