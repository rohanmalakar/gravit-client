import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

// Accessible button component with primary and ghost variants
// Includes focus states and hover animations
const Button = ({ 
  variant = 'primary', 
  children, 
  className,
  onClick,
  type = 'button',
  disabled = false,
  'aria-label': ariaLabel,
}: ButtonProps) => {
  const baseStyles = 'px-8 py-3.5 rounded-full font-medium text-base transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary3 focus:ring-primary2/50 shadow-lg hover:shadow-xl',
    ghost: 'border-2 border-muted text-deep hover:border-primary hover:text-primary focus:ring-primary/20',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(baseStyles, variantStyles[variant], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
