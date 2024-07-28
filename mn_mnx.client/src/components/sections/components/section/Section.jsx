import PropTypes from "prop-types"
import classNames from "classnames"

import Heading from "../../../heading"
import Child from "../child"

import styles from "./Section.module.css"

const contentSizeTypes = {
    default: 1,
    small: 2,
    medium: 3,
    large: 4
}

const contentStyle = {
    [contentSizeTypes.default]: styles["default"],
    [contentSizeTypes.small]: styles["small"],
    [contentSizeTypes.medium]: styles["medium"],
    [contentSizeTypes.large]: styles["large"]
}

const propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    titleLevel: PropTypes.number,
    showTitle: PropTypes.bool,
    contentSize: PropTypes.oneOf(Object.values(contentSizeTypes)),
    contentProps: PropTypes.object,
    fullHeight: PropTypes.bool,
    items: PropTypes.array
}
const defaultProps = {
    titleLevel: 2,
    contentSize: contentSizeTypes.default,
    fullHeight: true,
    showTitle: true
}

const Section = ({
    id,
    title,
    titleLevel,
    contentSize,
    fullHeight,
    showTitle,
    items
}) => (
    <section
        id={id}
        className={classNames(
            styles["section-wrapper"],
            {
                [styles["full-size"]]: fullHeight
            }
        )}
    >
        {(showTitle && title) && (
            <Heading
                className={styles["section-title"]}
                level={titleLevel}
            >
                {title}
            </Heading>
        )}
        <div className={classNames(
            styles["section-contents"],
            contentStyle[contentSize]
        )}>
            {items.map(({
                shadow,
                center,
                ...child
            }, index) => (
                <Child
                    key={index}
                    className={classNames(
                        styles["child-wrapper"],
                        {
                            [styles["shadow"]]: shadow,
                            [styles["center"]]: center
                        }
                    )}
                    {...child}
                />
            ))}
        </div>
    </section>
)
Section.propTypes = propTypes
Section.defaultProps = defaultProps

Section.contentSizeTypes = contentSizeTypes

export default Section