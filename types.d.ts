// define your mf types here

declare module "aos";

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "spotify-web-api-node";

interface SVGProps {
  fill?: string;
  className?: string;
  onClick?: () => void;
}
type Props = {
  show?: boolean;
};

type InputProps = {
  id?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  loading?: boolean;
  noDefault?: boolean;
  size?: "default" | "sm" | "lg";
  variant?: "primary" | "default" | "secondary" | "danger" | "google";
}

type ModalProps = {
  close?: boolean;
  title?: string;
  isOpen: boolean;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
};

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  defaultValue?: string;
  className?: string;
  onChange?: (value: string) => void;
};

type Tab = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: Tab[];
  className?: string;
  defaultValue?: string;
  buttonClassName?: string;
  onChange?: (value: string) => void;
};

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
};

type TextAreaProps = {
  name: string;
  value: string;
  error?: string;
  onChange: (e: any) => void;
  placeholder?: string;
  className?: string;
};

type OTPState = {
  [key: string]: string;
};
