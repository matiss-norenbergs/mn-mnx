import { forwardRef, useCallback, useEffect, useState } from "react"

import Select from "@/components/select"

import { getTimeZoneOptions } from "@/helpers/axios/genericService"

const TimeZoneSelect = ({
    ...rest
}) => {
    const [options, setOptions] = useState([])

    const handleGetOptions = useCallback(() => {
        getTimeZoneOptions()
            .then(response => {
                if (!!response && response.status === 200)
                    setOptions(response.data)
            })
    }, [])

    useEffect(() => {
        handleGetOptions()
    }, [handleGetOptions])

    return (
        <Select
            {...rest}
            items={options}
            disabled={options.length === 0}
        />
    )
}

TimeZoneSelect.displayName = "TimeZoneSelect"

export default TimeZoneSelect