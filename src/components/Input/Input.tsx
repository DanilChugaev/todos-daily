import './input.pcss';

export function Input({ label, type, value, onChange, placeholder }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      <input className="input"
             type={type}
             value={value}
             onChange={onChange}
             placeholder={placeholder}
      />
    </div>
  );
}