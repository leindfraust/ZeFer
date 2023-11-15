"use client"

import type { FormContext } from "@/types/formContext";
import { useFormContext } from 'react-hook-form'

export default function Input({ name, type, placeholder, required, value, maxLength }: FormContext) {

    const { register, watch, formState: { errors } } = useFormContext();

    return (<div className="form-control w-full">
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
                className="input input-bordered w-full" />
        ) : (<>
            <textarea className=" textarea textarea-bordered w-full" {...register(name, {
                value: value,
                maxLength: maxLength?.value
            })}
                onKeyDown={(e) => {
                    if (e.key !== 'Backspace' && watch(name) !== undefined && maxLength?.value && watch(name)?.length >= maxLength?.value) e.preventDefault();
                }} />
            <div className="flex justify-end">
                {watch(name) !== undefined && maxLength?.value && `${watch(name).length} / ${maxLength?.value}`}
            </div>
        </>)}
        {errors[name]?.type === 'maxLength' && <span className="p-2 bg-warning">{maxLength?.message}</span>}
        {errors[name]?.type === 'required' && <span className="p-2 bg-warning">{required.message}</span>}
    </div>)
}