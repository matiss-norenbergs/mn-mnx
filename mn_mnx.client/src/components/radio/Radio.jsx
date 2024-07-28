import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./Radio.module.css"

const propTypes = {
    className: PropTypes.string
}
const defaultProps = {}

const Radio = ({
    className,
    ...rest
}) => {
    return (
        <input
            className={classNames(
                styles["radio-wrapper"],
                className
            )}
            type="radio"
            {...rest}
        />
    )
}
Radio.propTypes = propTypes
Radio.defaultProps = defaultProps

export default Radio