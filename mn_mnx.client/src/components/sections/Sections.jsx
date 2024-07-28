import PropTypes from "prop-types"

import Anchor from "../anchor"

import Child from "./components/child"
import Section from "./components/section"

import styles from "./Sections.module.css"

const { contentSizeTypes } = Section

const propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        titleLevel: PropTypes.number,
        showTitle: PropTypes.bool,
        contentSize: PropTypes.oneOf(Object.values(contentSizeTypes)),
        contentProps: PropTypes.object,
        children: PropTypes.array
    }))
}
const defaultProps = {}

const Sections = ({ items }) => {
    const anchorItems = items.map(({
        id,
        title
    }) => ({
        key: id,
        title,
        href: `/#${id}`
    }))

    return (
        <div className={styles["sections-wrapper"]}>
            <Anchor
                className={styles["section-anchor"]}
                items={anchorItems}
            />
            {items.map(({
                children,
                contentProps,
                ...rest
            }) => {
                return (
                    <Section
                        key={rest.id}
                        items={children}
                        {...rest}
                    />
                )
            })}
        </div>
    )
}
Sections.propTypes = propTypes
Sections.defaultProps = defaultProps

Sections.contentSizeTypes = contentSizeTypes
Sections.contentTypes = Child.contentTypes

Sections.Section = Section

export default Sections