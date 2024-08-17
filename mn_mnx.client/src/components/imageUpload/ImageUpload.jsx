import PropTypes from "prop-types"
import classNames from "classnames"

import {
    useCallback,
    useRef,
    useState
} from "react"

import FaIcon from "../faIcon"

import styles from "./ImageUpload.module.css"

const propTypes = {
    onChange: PropTypes.func,
    layout: PropTypes.oneOf([
        "portrait",
        "landscape",
        "square"
    ]),
    value: PropTypes.any
}

const ImageUpload = ({
    onChange,
    layout = "portrait"
}) => {

    const inputElementRef = useRef(null)

    const [preview, setPreview] = useState("")

    const handleClick = useCallback(() => {
        if (preview)
            return

        inputElementRef.current?.click()
    }, [preview])

    const handleImageChange = useCallback((e) => {
        if (e.target.files.length === 1) {
            const image = e.target.files[0]

            setPreview(URL.createObjectURL(image))
            onChange(image)
        }
    }, [onChange])

    const handleRemove = useCallback(() => {
        setPreview("")
        onChange("")
    }, [onChange])

    return (
        <div
            className={classNames(
                styles["input-image"],
                styles[layout],
                {
                    [styles["input-image-empty"]]: !preview
                }
            )}
            onClick={handleClick}
        >
            <label>
                { preview ? (
                    <>
                        <img
                            className={styles["input-image-content"]}
                            src={preview}
                            alt="Preview"
                            onClick={handleClick}
                        />
                        <FaIcon
                            className={styles["image-remove-button"]}
                            icon="xmark"
                            onClick={handleRemove}
                        />
                    </>
                ) : (
                    <div className={styles["input-image-content"]}>
                        Upload your image<br />
                        <FaIcon
                            className={styles["upload-icon"]}
                            icon="image"
                        />
                    </div>
                )}
            </label>
            <input
                ref={inputElementRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />
        </div>
    )
}
ImageUpload.propTypes = propTypes
ImageUpload.displayName = "ImageUpload"

export default ImageUpload