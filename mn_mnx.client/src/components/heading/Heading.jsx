import PropTypes from "prop-types"
import classNames from "classnames"

import styles from "./Heading.module.css"

const headingLevelTypes = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6"
}

const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    level: PropTypes.oneOf(Object.keys(headingLevelTypes).map(Number)),
    center: PropTypes.bool
}
const defaultProps = {
    level: 1
}

const Heading = ({
    className,
    children,
    level,
    center
}) => (
    <div className={classNames(
        styles["heading-wrapper"],
        styles[headingLevelTypes[level]],
        {
            [styles["center"]]: center
        },
        className
    )}>
        {children}
    </div>
)
Heading.propTypes = propTypes
Heading.defaultProps = defaultProps

export default Heading