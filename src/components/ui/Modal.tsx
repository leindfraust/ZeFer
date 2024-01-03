"use client";

import { cn } from "@/utils/cn";
import React, { forwardRef } from "react";

type ModalProps = React.HTMLAttributes<HTMLDivElement>;
const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    ({ className, children }, ref) => {
        return (
            <dialog className="modal" ref={ref}>
                <div className={cn("modal-box", className)}>{children}</div>
            </dialog>
        );
    },
);

Modal.displayName = "Modal";

export default Modal;
