type FormContext = {
    name: string;
    type:
        | "button"
        | "checkbox"
        | "color"
        | "date"
        | "datetime-local"
        | "email"
        | "file"
        | "hidden"
        | "image"
        | "month"
        | "number"
        | "password"
        | "radio"
        | "range"
        | "reset"
        | "search"
        | "submit"
        | "tel"
        | "text"
        | "textarea"
        | "time"
        | "url"
        | "week";
    placeholder?: string;
    value?: string | number;
    maxLength?: {
        value: number;
        message: string;
    };
    required: {
        value: boolean;
        message: string;
    };
    disabled?: boolean;
};

export type { FormContext };
