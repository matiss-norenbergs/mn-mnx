import PropTypes from "prop-types"

import { Image } from "antd"

import Heading from "../../../heading"

import styles from "./Child.module.css"

const contentTypes = {
    text: 1,
    textHeading: 2,
    img: 3
}

const propTypes = {
    className: PropTypes.string,
    contentType: PropTypes.oneOf(Object.values(contentTypes)),
    contentProps: PropTypes.object,
    title: PropTypes.string,
    titleLevel: PropTypes.number,
    shadow: PropTypes.bool,
    center: PropTypes.bool
}
const defaultProps = {
    titleLevel: 3,
    center: true
}

const Child = ({
    className,
    contentType,
    contentProps,
    title,
    titleLevel
}) => {
    let childContent = null

    switch (contentType) {
        case contentTypes.img:
            childContent = (
                <Image {...contentProps} />
            )
            break
        case contentTypes.textHeading:
            break
        default:
            childContent = (
                <p className={styles["child-paragraph"]}>
                    {contentProps?.children}
                </p>
            )
            break
    }

    return (
        <div className={className}>
            {title && (
                <Heading
                    className={styles["child-title"]}
                    level={titleLevel}
                >
                    {title}
                </Heading>
            )}
            {childContent}
        </div>
    )
}
Child.propTypes = propTypes
Child.defaultProps = defaultProps

Child.contentTypes = contentTypes

export default Child