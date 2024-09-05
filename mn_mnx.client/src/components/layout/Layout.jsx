import PropTypes from "prop-types"

import {
    Breadcrumbs,
    BreadcrumbItem
} from "@nextui-org/react"

import styles from "./Layout.module.css"
import classNames from "classnames"

const layoutTypes = {
    basic: "basic-layout",
    center: "centered-layout",
    slim: "slim-layout",
}

const propTypes = {
    children: PropTypes.node,
    type: PropTypes.oneOf(Object.keys(layoutTypes)),
    breadcrumbItems: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string,
        label: PropTypes.node
    }))
}

const Layout = ({
    children,
    type = "basic",
    breadcrumbItems = []
}) => {
    return (
        <div className={styles["layout-wrapper"]}>
            {breadcrumbItems.length > 0 && (
                <Breadcrumbs
                    className={classNames(
                        styles["breadcrumb"],
                        "bg-grey"
                    )}
                >
                    {breadcrumbItems.map(({ href, label }, index) => (
                        <BreadcrumbItem
                            key={index}
                            href={href}
                        >
                            {label}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
            )}
            <div className={styles[layoutTypes[type]]}>
                {children}
            </div>
        </div>
    )
}
Layout.propTypes = propTypes

export default Layout