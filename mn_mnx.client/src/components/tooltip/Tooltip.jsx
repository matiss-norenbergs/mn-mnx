import PropTypes from "prop-types"

import { useCallback, useRef, useState } from "react"
import classNames from "classnames"

import styles from "./Tooltip.module.css"

const tooltipDirections = {
    top: "top",
    left: "left",
    right: "right",
    bottom: "bottom"
}

const propTypes = {
    children: PropTypes.node,
    text: PropTypes.string.isRequired,
    delay: PropTypes.number,
    direction: PropTypes.oneOf(Object.values(tooltipDirections))
}
const defaultProps = {
    delay: 200,
    direction: tooltipDirections.top
}

const Tooltip = ({
    children,
    text,
    delay,
    direction
}) => {
    const [active, setActive] = useState(false)

    const timeoutRef = useRef(null)

    const showTooltip = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setActive(true)
        }, delay)
    }, [delay])

    const hideTooltip = useCallback(() => {
        clearInterval(timeoutRef.current)
        setActive(false)
    }, [])

    return (
        <div
            className={styles["tooltip-wrapper"]}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
        >
            {children}
            {active && (
                <span className={classNames(
                    styles["text"],
                    styles[direction]
                )}>
                    {text}
                </span>
            )}
        </div>
    )
}
Tooltip.propTypes = propTypes
Tooltip.defaultProps = defaultProps

export default Tooltip