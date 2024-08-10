import PropTypes from "prop-types"

import FaIcon from "@/components/faIcon"

const propTypes = {
    value: PropTypes.bool
}

const YesNoIconRenderer = ({
    value
}) => {
    return (
        <FaIcon icon={value ? ["fas", "circle-check"] : ["far", "circle"]} />
    )
}
YesNoIconRenderer.propTypes = propTypes

export default YesNoIconRenderer