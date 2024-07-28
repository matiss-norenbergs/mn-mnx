import PropTypes from "prop-types"

import styles from "./Layout.module.css"

const layoutTypes = {
    basic: "basic-layout",
    center: "centered-layout"
}

const propTypes = {
    children: PropTypes.node,
    layoutType: PropTypes.oneOf(Object.keys(layoutTypes))
}
const defaultProps = {
    layoutType: "basic"
}

const Layout = ({
    children,
    layoutType
}) => {
    return (
        <div className={styles[layoutTypes[layoutType]]}>
            {children}
        </div>
    )
}
Layout.propTypes = propTypes
Layout.defaultProps = defaultProps

export default Layout