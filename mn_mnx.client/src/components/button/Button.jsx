import PropTypes from "prop-types"
import classNames from "classnames"

import FaIcon from "../faIcon"

import Group from "./components/group"
import Spacer from "./components/spacer"

import styles from "./Button.module.css"

const buttonTypes = {
    default: "default",
    primary: "primary",
    ghost: "ghost"
}

const propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    faIcon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]),
    onClick: PropTypes.func,
    type: PropTypes.oneOf(Object.keys(buttonTypes))
}
const defaultProps = {
    type: buttonTypes.default,
    disabled: false
}

const Button = ({
    active,
    children,
    className,
    faIcon,
    type,
    disabled,
    ...rest
}) => {
    const buttonStyles = classNames(
        styles["button-wrapper"],
        styles[`${type}`],
        {
            [styles["active"]]: active && !disabled,
            [styles["disabled"]]: disabled
        },
        className
    )

    return (
        <button
            className={buttonStyles}
            disabled={disabled}
            {...rest}
        >
            {faIcon && (
                <FaIcon
                    icon={faIcon}
                    padded={!!children}
                    fixedWidth
                />
            )}
            {children}
        </button>
    )
}
Button.propTypes = propTypes
Button.defaultProps = defaultProps

Button.Group = Group
Button.Spacer = Spacer

export default Button