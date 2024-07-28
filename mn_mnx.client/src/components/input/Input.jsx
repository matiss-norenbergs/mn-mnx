import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./Input.module.css"

const propTypes = {
    className: PropTypes.string,
    password: PropTypes.bool
}
const defaultProps = {}

const Input = ({
    className,
    password,
    ...rest
}) => {
    return (
        <input
            className={classNames(
                styles["mn-input"],
                className
            )}
            type={password ? "password" : "text"}
            {...rest}
        />
    )
}
Input.propTypes = propTypes
Input.defaultProps = defaultProps

export default Input