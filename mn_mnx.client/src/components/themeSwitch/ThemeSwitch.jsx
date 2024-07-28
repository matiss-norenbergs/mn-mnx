import PropTypes from "prop-types"

import classNames from "classnames"
import { useState } from "react"

import FaIcon from "../faIcon"

import styles from "./ThemeSwitch.module.css"

const propTypes = {
    className: PropTypes.string
}
const defaultProps = {}

const MN_THEME_DARK = "MN_THEME_DARK"

const ThemeSwitch = ({ className }) => {
    const [theme, setTheme] = useState(!localStorage.getItem(MN_THEME_DARK))

    const handleThemeSwitch = () => {
        setTheme(prevTheme => {
            const newTheme = !prevTheme

            if (!newTheme)
                localStorage.setItem(MN_THEME_DARK, "true")
            else
                localStorage.removeItem(MN_THEME_DARK)

            return newTheme
        })
    }

    return (
        <span
            className={classNames(
                styles["theme-switch"],
                className
            )}
            id="user-theme"
            data-active={theme ? "light" : "dark"}
            onClick={handleThemeSwitch}
        >
            <FaIcon
                icon={theme ? "moon" : "sun"}
                fixedWidth
            />
        </span>
    )
}
ThemeSwitch.propTypes = propTypes
ThemeSwitch.defaultProps = defaultProps

export default ThemeSwitch