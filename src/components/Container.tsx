import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'wide' | 'narrow';
}

// Responsive container component for consistent max-width and padding
const Container = ({ children, className, size = 'default' }: ContainerProps) => {
  const sizeStyles = {
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    narrow: 'max-w-4xl',
  };

  return (
    <div className={clsx('mx-auto px-4 sm:px-6 lg:px-8', sizeStyles[size], className)}>
      {children}
    </div>
  );
};

export default Container;
