import PropTypes from "prop-types"

import {
    Checkbox as NextCheckbox
} from "@nextui-org/react"

const propTypes = {
    label: PropTypes.string,
    checked: PropTypes.bool,
    defaultValue: PropTypes.bool
}

const Checkbox = ({
    label,
    checked,
    ...rest
}) => {
    return (
        <NextCheckbox
            isSelected={checked}
            {...rest}
        >
            {label}
        </NextCheckbox>
    )
}
Checkbox.propTypes = propTypes

export default Checkbox