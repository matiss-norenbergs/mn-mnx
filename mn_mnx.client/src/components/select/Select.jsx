import PropTypes from "prop-types"

import {
    Select as NextSelect,
    SelectItem as NextSelectItem
} from "@nextui-org/react"

//import styles from "./Select.module.css"

const propTypes = {
    className: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        value: PropTypes.string.isRequired
    })),
    value: PropTypes.any
}

const Select = ({
    items,
    value,
    ...rest
}) => {
    const selectedKeys = Array.isArray(value) ? value : [value]

    return (
        <NextSelect
            variant="bordered"
            labelPlacement="outside"
            items={items}
            selectedKeys={selectedKeys}
            {...rest}
        >
            {({ key, value}) => (
                <NextSelectItem key={key}>
                    {value}
                </NextSelectItem>
            )}
        </NextSelect>
    )
}
Select.propTypes = propTypes

export default Select