import { StylesConfig } from "react-select";

type OptionType = {
  label: string;
  value: string;
};

export const darkStyles: StylesConfig<OptionType, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
    borderColor: "#374151",
    color: "#f9fafb",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f2937",
    color: "#f9fafb",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#374151" : "#1f2937",
    color: "#f9fafb",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#f9fafb",
  }),
  input: (base) => ({
    ...base,
    color: "#f9fafb",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
  }),
};

export const lightStyles: StylesConfig<OptionType, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#ffffff",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    color: "#111827",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#ffffff",
    color: "#111827",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e5e7eb" : "#ffffff",
    color: "#111827",
    cursor: "pointer",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#111827",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6b7280",
  }),
  groupHeading: (base) => ({
    ...base,
    color: "#6b7280",
    fontWeight: 600,
    fontSize: "0.75rem",
    padding: "0.5rem 0.75rem",
  }),
};
