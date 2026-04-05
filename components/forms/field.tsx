import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | number;
  type?: string;
};

export function TextField({ label, name, placeholder, required, defaultValue, type = "text" }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand"
      />
    </label>
  );
}

export function TextAreaField({ label, name, placeholder, required, defaultValue }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        name={name}
        defaultValue={String(defaultValue ?? "")}
        required={required}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand"
      />
    </label>
  );
}

export function SelectField({
  label,
  name,
  required,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-base outline-none transition focus:border-brand"
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={cn("w-full rounded-2xl bg-brand px-5 py-3 text-base font-bold text-white shadow-sm transition hover:bg-brand-dark", className)}
    >
      {children}
    </button>
  );
}
