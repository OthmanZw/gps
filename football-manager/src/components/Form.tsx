import React from 'react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'email' | 'password';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  initialData?: any;
  submitLabel?: string;
}

export const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  initialData = {},
  submitLabel = 'Enregistrer'
}) => {
  const [formData, setFormData] = React.useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required={field.required}
            >
              <option value="">Sélectionnez une option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
        </div>
      ))}

      <div className="pt-5">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}; 