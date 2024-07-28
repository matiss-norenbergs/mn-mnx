import PropTypes from "prop-types"

import classNames from "classnames"
import { useCallback } from "react"

import styles from "./Dropdown.module.css"

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        label: PropTypes.node,
        onClick: PropTypes.func,
        selected: PropTypes.bool,
        disabled: PropTypes.bool
    }))
}
const defaultProps = {
    items: []
}

const Dropdown = ({
    className,
    children,
    items
}) => {

    const handleItemClick = useCallback((itemOnClick, itemKey, itemDisabled) => (e) => {
        e.preventDefault()

        if (!!itemDisabled)
            return

        if (itemOnClick)
            itemOnClick(itemKey)
    }, [])

    return (
        <div className={classNames(
            styles["dropdown-wrapper"],
            className
        )}>
            {children}
            <div className={styles["dropdown-content"]}>
                {items.map(({
                    key,
                    label,
                    onClick,
                    selected,
                    disabled
                }) => (
                    <div
                        key={key}
                        className={styles["dropdown-item"]}
                        onClick={handleItemClick(onClick, key, disabled)}
                        aria-selected={selected}
                        aria-disabled={disabled}
                    >
                        {label}
                    </div>
                ))}
            </div>
        </div>
    )
}
Dropdown.propTypes = propTypes
Dropdown.defaultProps = defaultProps

export default Dropdown