"use client"

import type { FormContext } from "@/types/formContext";
import { useFormContext } from 'react-hook-form'

export default function Input({ name, type, placeholder, required, value }: FormContext) {

    const { register, formState: { errors } } = useFormContext();

    return (<div className="form-control w-full max-w-xs">
        <label htmlFor={name} className="label">
            <span className="label-text">{name} {required.value && <span className="text-red-500">*</span>}</span>
        </label>
        {type !== 'textarea' ? (

            <input
                type={type}
                placeholder={placeholder}
                {...register(name, {
                    value: value,
                    required: required
                })}
                className="input input-bordered w-full max-w-xs" />
        ) : (
            <textarea className=" textarea textarea-bordered w-full" {...register(name, {
                value: value,
                maxLength: 500
            })} />
        )}
        {errors[name]?.type === 'required' && <span className="p-2 bg-warning">{required.message}</span>}
    </div>)
}