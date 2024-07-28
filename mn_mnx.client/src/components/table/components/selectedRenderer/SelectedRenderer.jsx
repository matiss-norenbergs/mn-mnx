import PropTypes from "prop-types"

import Radio from "../../../radio"

//import styles from "./SelectedRenderer.module.css"

const propTypes = {
    selected: PropTypes.bool
}
const defaultProps = {}

const SelectedRenderer = ({ selected }) => {
    return (
        <Radio
            checked={selected}
            readOnly
        />
    )
}
SelectedRenderer.propTypes = propTypes
SelectedRenderer.defaultProps = defaultProps

export default SelectedRenderer