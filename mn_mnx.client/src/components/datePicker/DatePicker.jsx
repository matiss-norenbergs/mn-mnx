import {
    DatePicker as NextDatePicker
} from "@nextui-org/react"

const DatePicker = ({
    ...rest
}) => {
    return (
        <NextDatePicker
            variant="bordered"
            labelPlacement="outside"
            {...rest}
        />
    )
}

export default DatePicker