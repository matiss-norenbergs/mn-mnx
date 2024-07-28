import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./InputNumber.module.css"

const propTypes = {
    className: PropTypes.string
}
const defaultProps = {}

const InputNumber = ({
    className,
    ...rest
}) => {
    return (
        <input
            className={classNames(
                styles["mn-input-number"],
                className
            )}
            type="number"
            {...rest}
        />
    )
}
InputNumber.propTypes = propTypes
InputNumber.defaultProps = defaultProps

export default InputNumber