import PropTypes from "prop-types"

import classNames from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styles from "./FaIcon.module.css"

const propTypes = {
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    fixedWidth: PropTypes.bool,
    className: PropTypes.string,
    padded: PropTypes.bool,
    isHidden: PropTypes.bool
}
//const defaultProps = {}

const FaIcon = ({
    icon,
    fixedWidth,
    className,
    padded,
    isHidden,
    ...rest
}) => {
    if (isHidden)
        return

    return (
        <FontAwesomeIcon
            className={classNames(
                styles["fa-icon"],
                [styles[padded]],
                {
                    [styles["padded"]]: typeof padded == "boolean" && padded
                },
                className
            )}
            icon={icon}
            fixedWidth={fixedWidth}
            {...rest}
        />
    )
}
FaIcon.propTypes = propTypes
//FaIcon.defaultProps = defaultProps

export default FaIcon