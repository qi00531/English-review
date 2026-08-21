import type { ButtonHTMLAttributes } from 'react';

export function Action({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`action ${className}`.trim()} type="button" {...props} />;
}
