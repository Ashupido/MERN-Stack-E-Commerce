import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = 'Password',
  required = false,
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-bold text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full pr-12 ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-gray-400 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400"
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}
