export default function FormInput({
  label,
  name,
  register,
  errors,
  type = "text",
  required = false,
  placeholder = "",
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        placeholder={placeholder}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
