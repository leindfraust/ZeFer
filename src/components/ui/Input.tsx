"use client";

import type { FormContext } from "@/types/formContext";
import { RegisterOptions, useFormContext } from "react-hook-form";

export default function Input({
    name,
    type,
    placeholder,
    required,
    value,
    maxLength,
    onChange,
    disabled,
}: FormContext & RegisterOptions) {
    const {
        register,
        watch,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control w-full">
            <label htmlFor={name} className="label">
                <span className="label-text">
                    {name}{" "}
                    {required.value && <span className="text-red-500">*</span>}
                </span>
            </label>
            {type !== "textarea" ? (
                <input
                    type={type}
                    placeholder={placeholder}
                    {...register(name, {
                        value: value,
                        required: required,
                        onChange: onChange,
                        disabled: disabled,
                    })}
                    className="input input-bordered w-full"
                />
            ) : (
                <>
                    <textarea
                        className=" textarea textarea-bordered w-full"
                        {...register(name, {
                            value: value,
                            maxLength: maxLength?.value,
                        })}
                        onKeyDown={(e) => {
                            if (
                                e.key !== "Backspace" &&
                                watch(name) !== undefined &&
                                maxLength?.value &&
                                watch(name)?.length >= maxLength?.value
                            )
                                e.preventDefault();
                        }}
                    />
                    <div className="flex justify-end">
                        {watch(name) !== undefined &&
                            maxLength?.value &&
                            `${watch(name).length} / ${maxLength?.value}`}
                    </div>
                </>
            )}
            {errors[name]?.type === "uniqueConstraint" && (
                <p className="p-2 text-warning font-bold">
                    {errors[name]?.message?.toString()}
                </p>
            )}
            {errors[name]?.type === "maxLength" && (
                <p className="p-2 text-warning font-bold">
                    {maxLength?.message}
                </p>
            )}
            {errors[name]?.type === "required" && (
                <p className="p-2 text-warning font-bold">{required.message}</p>
            )}
        </div>
    );
}
