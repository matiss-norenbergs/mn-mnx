import PropTypes from "prop-types"

import {
    Link,
    Tooltip
} from "@nextui-org/react"

import FaIcon from "@/components/faIcon"

const propTypes = {
    data: PropTypes.object
}

const FunctionsRenderer = ({
    data
}) => {
    return (
        <Tooltip content="View profile">
            <Link
                href={`/profile/${data.id}`}
                isExternal
            >
                <FaIcon
                    icon="eye"
                    fixedWidth
                />
            </Link>
        </Tooltip>
    )
}
FunctionsRenderer.propTypes = propTypes

export default FunctionsRenderer