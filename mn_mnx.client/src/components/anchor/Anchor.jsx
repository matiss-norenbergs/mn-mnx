import PropTypes from "prop-types"

import classNames from "classnames"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'

import styles from "./Anchor.module.css"

const propTypes = {
    className: PropTypes.string,
    items: PropTypes.array
}

const Anchor = ({
    className,
    items
}) => {
    const [activeHash, setActiveHash] = useState("")

    return (
        <div className={classNames(
            styles["anchor-wrapper"],
            className
        )}>
            { items.map(item => (
                <AnchorItem
                    key={item.key}
                    item={item}
                    isActiveHash={activeHash === item.key}
                    setActiveHash={setActiveHash}
                />
            ))}
        </div>
    )
}
Anchor.propTypes = propTypes

const AnchorItem = ({
    item,
    isActiveHash,
    setActiveHash
}) => {
    const location = useLocation()

    //const threshold = .5
    
    useEffect(() => {
        const sectionElement = document.getElementById(item.key)
        // const elementHeight = sectionElement?.getBoundingClientRect().height
        // const value = window.innerHeight * threshold

        //let objectT = elementHeight > value ? (value / elementHeight) * threshold : threshold

        //console.log(item.key, objectT)

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setActiveHash(item.key)
            }
        },
        {
            root: null,
            threshold: .2,
            rootMargin: "48px"
        })

        if (!!sectionElement && !item.isNavLink) {
            observer.observe(sectionElement)
        }

        return () => {
            setActiveHash("")
            observer.disconnect()
        }
    }, [item, location, setActiveHash])

    return (
        <HashLink
            className={classNames(
                styles["anchor-item"],
                {
                    [styles["active"]]: isActiveHash
                }
            )}
            smooth
            to={item.href}
        >
            {item.title}
        </HashLink>
    )
}

export default Anchor