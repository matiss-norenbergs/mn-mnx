import PropTypes from "prop-types"
import { cloneElement } from "react"

import { Field as RcField } from "rc-field-form"

//import styles from "./Field.module.css"

const propTypes = {
    children: PropTypes.node,
    name: PropTypes.string,
    initialValue: PropTypes.any,
    rules: PropTypes.array,
    label: PropTypes.string,
    required: PropTypes.bool
}
const defaultProps = {}

const Field = ({
    children,
    label,
    ...rest
}) => {
    return (
        <RcField
            {...rest}
        >
            {(fieldProps, { errors }) => {
                return cloneElement(children, {
                    label,
                    errorMessage: errors,
                    isInvalid: errors.length > 0,
                    ...fieldProps
                })
            }}
        </RcField>
    )
}
Field.propTypes = propTypes
Field.defaultProps = defaultProps

export default Field