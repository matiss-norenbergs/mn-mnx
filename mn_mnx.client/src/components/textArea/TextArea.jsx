import PropTypes from "prop-types"

import {
    Textarea as NextTextarea
} from "@nextui-org/react"

//import styles from "./TextArea.module.css"

const propTypes = {
    label: PropTypes.string
}

const TextArea = ({
    ...rest
}) => {
    return (
        <NextTextarea
            variant="bordered"
            labelPlacement="outside"
            {...rest}
        />
    )
}
TextArea.propTypes = propTypes

export default TextArea