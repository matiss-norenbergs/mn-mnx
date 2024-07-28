import PropTypes from "prop-types"
import classNames from "classnames"
import { useMemo } from "react"

import styles from "./Select.module.css"

const propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        value: PropTypes.string.isRequired
    }))
}
const defaultProps = {
    items: []
}

const Select = ({
    className,
    items,
    ...rest
}) => {
    return (
        <select
            className={classNames(
                styles["mn-select"],
                className
            )}
            {...rest}
        >
            {useMemo(() => {
                return items.map(({
                    key,
                    value
                }) => (
                    <option
                        key={key}
                        value={key}
                    >
                        {value}
                    </option>
                ))
            }, [items])}
        </select>
    )
}
Select.propTypes = propTypes
Select.defaultProps = defaultProps

export default Select