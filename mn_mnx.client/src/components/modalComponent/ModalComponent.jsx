import PropTypes from "prop-types"
import classNames from "classnames"
import { cloneElement, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

import Button from "../button"
import FaIcon from "../faIcon"
import Heading from "../heading"
import Portal from "../portal"

import styles from "./ModalComponent.module.css"

const propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    confirmText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    cancelText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    onConfirm: PropTypes.func,
    component: PropTypes.node,
    isOpen: PropTypes.bool
}
const defaultProps = {
    confirmText: "Confirm",
    cancelText: "Cancel"
}

const ModalComponent = forwardRef(({
    className,
    component,
    title,
    width,
    confirmText,
    cancelText,
    onConfirm,
    isOpen
}, ref) => {
    const [modalTitle, setModalTitle] = useState(title)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const modalElementRef = useRef(null)
    const modalComponentRef = useRef(null)
    const modalComponentProps = useRef(null)

    const handleOpenClick = useCallback((passedProps) => {
        if (passedProps)
            modalComponentProps.current = Object.assign({}, passedProps)

        setIsModalOpen(true)
    }, [])

    const handleCloseClick = useCallback(() => {
        setModalTitle(title)
        setIsModalOpen(false)

        modalComponentProps.current = null
    }, [title])

    const handleConfirmBtnClick = useCallback(() => {
        if (modalComponentRef.current?.save) {
            modalComponentRef.current?.save()
                ?.then(() => {
                    handleCloseClick()

                    if (onConfirm)
                        onConfirm()
                })
                ?.catch(() => null)
        } else {
            handleCloseClick()
        }
    }, [handleCloseClick, onConfirm])

    useImperativeHandle(ref, () => ({
        open: handleOpenClick,
        close: handleCloseClick
    }), [handleOpenClick, handleCloseClick])

    useEffect(() => {
        if (isModalOpen)
            modalElementRef.current?.showModal()
        else
            modalElementRef.current?.close()
    }, [isModalOpen])

    useEffect(() => {
        if (isOpen)
            handleOpenClick()
        else
            handleCloseClick()
    }, [isOpen, handleOpenClick, handleCloseClick])

    const modalContent = isModalOpen ? cloneElement(
        component,
        {
            ref: modalComponentRef,
            setModalTitle: setModalTitle,
            ...modalComponentProps.current
        }
    ) : null

    const modalComponent = isModalOpen ? (
        <dialog
            ref={modalElementRef}
            className={classNames(
                styles["modal-component-wrapper"],
                className
            )}
            style={{ width: width }}
        >
            <header className={styles["header"]}>
                <Heading level={4}>
                    {modalTitle}
                </Heading>
                <FaIcon
                    className={styles["close-button"]}
                    icon="times"
                    onClick={handleCloseClick}
                />
            </header>
            <main className={styles["content"]}>
                {modalContent}
            </main>
            <footer className={styles["footer"]}>
                <div className={styles["buttons"]}>
                    {(cancelText !== false && !!cancelText) && (
                        <Button onClick={handleCloseClick}>
                            {cancelText}
                        </Button>
                    )}
                    {(confirmText !== false && !!confirmText) && (
                        <Button
                            type="primary"
                            onClick={handleConfirmBtnClick}
                        >
                            {confirmText}
                        </Button>
                    )}
                </div>
            </footer>
        </dialog>
    ) : null
    
    return (
        <Portal targetId="modal-root">
            {modalComponent}
        </Portal>
    )
})
ModalComponent.propTypes = propTypes
ModalComponent.defaultProps = defaultProps

export default ModalComponent