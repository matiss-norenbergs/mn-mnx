
import PropTypes from "prop-types"

import {
    cloneElement,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from "react"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure
} from "@nextui-org/react"

import styles from "./ModalComponent.module.css"

const propTypes = {
    title: PropTypes.string,
    component: PropTypes.node,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    onConfirm: PropTypes.func,
    onModalConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    disableEsc: PropTypes.bool,
    size: PropTypes.string
}

const ModalComponent = forwardRef(({
    title,
    component,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    disableEsc = false,
    size = "lg",
    onModalConfirm = "save",
    ...rest
}, ref) => {
    const [modalTitle, setModalTitle] = useState(title)

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const modalComponentRef = useRef(null)
    const modalComponentProps = useRef(null)

    const handleOpenClick = useCallback((passedProps) => {
        if (passedProps)
            modalComponentProps.current = Object.assign({}, passedProps)

        onOpen()
    }, [onOpen])

    const handleCloseClick = useCallback(() => {
        if (modalComponentRef.current?.close) {
            modalComponentRef.current?.close()
                ?.then(() => {
                    onClose()
                    onCancel?.()
                })
        } else {
            onClose()
        }
    }, [onCancel, onClose])

    const handleConfirmClick = useCallback(() => {
        if (modalComponentRef.current?.[onModalConfirm]) {
            modalComponentRef.current[onModalConfirm]()
                ?.then(() => {
                    onClose()
                    onConfirm?.()
                })
        } else {
            onClose()
        }
    }, [onClose, onConfirm, onModalConfirm])

    useImperativeHandle(ref, () => ({
        open: handleOpenClick,
        close: handleCloseClick
    }), [handleOpenClick, handleCloseClick])

    useEffect(() => {
        if (!isOpen) {
            modalComponentProps.current = null
            setModalTitle(title)
        }
    }, [isOpen, title])

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
            isDismissable={!disableEsc}
            isKeyboardDismissDisabled={disableEsc}
            size={size}
            {...rest}
        >
            <ModalContent>
                <ModalHeader className={styles["modal-header"]}>
                    {modalTitle}
                </ModalHeader>
                <ModalBody>
                    {cloneElement(
                        component,
                        {
                            ref: modalComponentRef,
                            setModalTitle: setModalTitle,
                            ...modalComponentProps.current
                        }
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        onPress={onClose}
                        size="sm"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onPress={handleConfirmClick}
                        color="primary"
                        size="sm"
                    >
                        {confirmText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
})
ModalComponent.propTypes = propTypes
ModalComponent.displayName = "ModalComponent"

export default ModalComponent