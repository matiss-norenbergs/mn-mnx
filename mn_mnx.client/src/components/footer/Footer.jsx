import { useEffect } from "react"

import styles from "./Footer.module.css"

const setStyle = document.querySelector(":root").style

const Footer = () => {

    useEffect(() => {
        setStyle.setProperty("--footer-height", "4rem")
    }, [])

    return (
        <footer className={styles["footer-wrapper"]}>
            <span className={styles["text"]}>
                © Matīss Norenbergs
            </span>
        </footer>
    )
}

export default Footer