'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare'
import { EditUserDetailsProps, UserSocials } from '@/types/user'
import { useRouter } from 'next/navigation'
import { FormContext } from '@/types/formContext'
import { FormProvider, useForm } from 'react-hook-form'
import Input from '@/components/Input'
import { Fragment, useRef } from 'react'

export default function EditName({ vanityUrl, name, bio, address, occupation, email, socials, viewsVisibility, }: EditUserDetailsProps) {
    const router = useRouter()
    const socialForms: FormContext[] = [
        {
            name: 'Facebook',
            type: 'text',
            placeholder: 'Your facebook link',
            value: socials?.find(social => social.name === 'Facebook')?.url ? socials?.find(social => social.name === 'Facebook')?.url : '',
            required: {
                value: false,
                message: ''
            },
        },
        {
            name: 'Twitter',
            type: 'text',
            placeholder: 'Your twitter link',
            value: socials?.find(social => social.name === 'Twitter')?.url ? socials?.find(social => social.name === 'Twitter')?.url : '',
            required: {
                value: false,
                message: ''
            }
        },
        {
            name: 'Personal Website',
            type: 'text',
            placeholder: 'Your personal website link',
            value: socials?.find(social => social.name === 'Personal Website')?.url ? socials?.find(social => social.name === 'Personal Webite')?.url : '',
            required: {
                value: false,
                message: ''
            },
        },
    ]
    const user_modal_edit = useRef<HTMLDialogElement>(null)
    const submissions = useForm()

    const vanityUrl_validation: FormContext = {
        name: vanityUrl ? vanityUrl : 'VanityURL',
        type: 'text',
        placeholder: 'Your unique vanity url',
        value: vanityUrl ? vanityUrl : '',
        required: {
            value: false,
            message: 'This field is not required'
        }
    }

    const name_validation: FormContext = {
        name: 'Name',
        type: 'text',
        placeholder: 'Your display name',
        value: name ? name : '',
        required: {
            value: true,
            message: 'This field is required'
        }
    }

    const bio_validation: FormContext = {
        name: 'Bio',
        type: 'textarea',
        value: bio ? bio : '',
        placeholder: 'Describe who you are...',
        required: {
            value: false,
            message: ''
        }
    }

    const address_validation: FormContext = {
        name: 'Address',
        type: 'text',
        placeholder: 'Your address',
        value: address ? address : '',
        required: {
            value: false,
            message: ''
        }
    }

    const email_validation: FormContext = {
        name: 'Email',
        type: 'text',
        placeholder: 'Your email',
        value: email ? email : '',
        required: {
            value: true,
            message: 'This field is required'
        }
    }

    const occupation_validation: FormContext = {
        name: 'Occupation',
        type: 'text',
        placeholder: 'Your job right now...',
        value: occupation ? occupation : '',
        required: {
            value: false,
            message: ''
        }
    }

    const updateDetails = submissions.handleSubmit(async data => {
        let socials: UserSocials[] = []
        socialForms.forEach(social => socials.push({
            name: social.name,
            url: data[social.name]
        }))

        const update = await fetch('/api/user', {
            method: "PATCH",
            body: JSON.stringify({
                vanityUrl: data.VanityURL,
                name: data.Name,
                bio: data.Bio,
                address: data.Address,
                occupation: data.Occupation,
                email: data.Email,
                socials: socials,
                viewsVisibility
            })
        })
        if (update.ok) {
            router.refresh()
            user_modal_edit.current?.close()
        }
    })


    return (<>
        <FontAwesomeIcon onClick={() => user_modal_edit.current?.show()} icon={faPenToSquare} className="absolute md:right-40 -right-2 top-0 cursor-pointer" size="sm" />
        <dialog ref={user_modal_edit} className="modal">
            <form method="dialog" className="modal-box">
                <div className="container p-4 justify-center flex flex-wrap space-y-4">
                    <FormProvider {...submissions}>
                        <Input {...vanityUrl_validation} />
                        <Input {...name_validation} />
                        <Input {...bio_validation} />
                        <Input {...address_validation} />
                        <Input {...occupation_validation} />
                        <Input {...email_validation} />
                        {socialForms.length !== 0 && socialForms.map(social => (
                            <Fragment key={social.name}>
                                <Input {...social} />
                            </Fragment>
                        ))}
                    </FormProvider>
                </div>
                <div className=' divider divider-vertical'></div>
                <button className='btn btn-success' onClick={updateDetails}>Update</button>
                <div className="modal-action">
                    <button className="btn">Close</button>
                </div>
            </form>
        </dialog>
    </>)
}