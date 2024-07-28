import PropTypes from "prop-types"

import classNames from "classnames"
import { Children, cloneElement } from "react"

import Button from "../../Button"

import styles from "./Group.module.css"

const propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool
}
const defaultProps = {}

const Group = ({
    className,
    disabled,
    children
}) => {
    const buttonGroupItems = Children.map(children, (element) => {
        if (element.type === Button) {
            return cloneElement(element, {
                className: styles["group-item"],
                disabled: element.props.disabled || disabled
            })
        }

        return element
    })

    return (
        <div
            className={classNames(
                styles["button-group-wrapper"],
                className
            )}
        >
            {buttonGroupItems}
        </div>
    )
}
Group.propTypes = propTypes
Group.defaultProps = defaultProps

export default Group