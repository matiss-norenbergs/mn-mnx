import PropTypes from "prop-types"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

const propTypes = {
    children: PropTypes.node,
    targetId: PropTypes.string
}
const defaultProps = {}

const Portal = ({
    children,
    targetId
}) => {
    const target = useRef(null)

    useEffect(() => {
        let container = document.getElementById(targetId)

        if (!container) {
            container = document.createElement("div")
            container.setAttribute("id", targetId)
            document.body.appendChild(container)
        }

        container.appendChild(target.current)

        return () => {
            target.current.remove()

            if (container.childNodes.length === 0)
                container.remove()
        }
    }, [targetId])

    if (!target.current)
        target.current = document.createElement("div")

    return createPortal(children, target.current)
}
Portal.propTypes = propTypes
Portal.defaultProps = defaultProps

export default Portal