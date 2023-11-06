/* eslint-disable @next/next/no-img-element */
import Image from '@tiptap/extension-image'
import { NodeViewProps, NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { useRef, useState } from 'react';

function ImageNode(props: NodeViewProps) {
    const { src, alt } = props.node.attrs
    const [altImg, setAltImg] = useState<string>(alt)
    const [imgHovered, setImgHovered] = useState<boolean>(false)
    const altImg_modal = useRef<HTMLDialogElement>(null)
    const { updateAttributes } = props

    let className = 'image'
    if (props.selected) { className += ' ProseMirror-selectednode' }

    return (

        <NodeViewWrapper className={`${className} relative`} data-drag-handle onMouseOver={() => setImgHovered(true)} onMouseOut={() => setImgHovered(false)}>
            <img src={src} alt={alt} />
            <span className='flex justify-center'>
                <dialog ref={altImg_modal} className="modal">
                    <div className="modal-box">
                        <div className="flex justify-center flex-wrap space-y-4 p-4">
                            <label className=' label'>Add Alt Text</label>
                            <input type="text" placeholder="Describe your image (Optional)" className="input input-bordered w-full max-w-xs" onChange={(e) => setAltImg(e.currentTarget.value)} value={altImg} />
                            <br />
                            <button className="btn" onClick={() => {
                                updateAttributes({ alt: altImg })
                                altImg_modal.current?.close()
                            }}>Confirm Alt</button>
                        </div>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn">Close</button>
                            </form>
                        </div>
                    </div>
                </dialog>
                {imgHovered && <div className='flex items-center gap-2 absolute top-4 left-2 bg-base-200 p-2 rounded-lg'>
                    {alt ? (<>
                        <span>{alt}</span>
                        <button className=' underline font-bold' onClick={() => altImg_modal.current?.show()}>Edit</button>
                    </>
                    ) : (<>
                        <span className='text-warning'>Alt text missing!</span>
                        <button className=' underline font-bold' onClick={() => altImg_modal.current?.show()}>Edit</button>
                    </>
                    )}
                </div>}
            </span>
        </NodeViewWrapper>
    )
}

export default Image.extend({
    addNodeView() {
        return ReactNodeViewRenderer(ImageNode)
    }
})