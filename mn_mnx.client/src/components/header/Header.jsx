import PropTypes from "prop-types"
import classNames from "classnames"
import { useDispatch, useSelector } from "react-redux"
import { useCallback } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import Button from "../button"
import MNIcon from "../mnIcon"
import FaIcon from "../faIcon"
import ThemeSwitch from "../themeSwitch"
import Heading from "../heading"
import Dropdown from "../dropdown"

import { logoutUser } from "@/helpers/axios/authService"
import { removeUser } from "@/redux/features/user/userSlice"

import styles from "./Header.module.css"

const propTypes = {
    paths: PropTypes.array,
    extraContent: PropTypes.node,
    appTitle: PropTypes.string,
    showLogo: PropTypes.bool,
    logoutUser: PropTypes.func
}
const defaultProps = {
    paths: [],
    showLogo: true
}

const Header = ({
    paths,
    extraContent,
    appTitle,
    showLogo,
}) => {
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogin = useCallback(() => {
        navigate("/login")
    }, [navigate])

    const handleLogout = useCallback(() => {
        logoutUser()
            .then(response => {
                if (response.status === 200) {
                    dispatch(removeUser())
                }
            })
    }, [dispatch])

    return (
        <header className={styles["header-wrapper"]}>
            <div className={styles["header-left-side"]}>
                {showLogo && (
                    <MNIcon className={styles["header-logo"]} />
                )}
                <Heading
                    className={styles["header-app-title"]}
                    level={1}
                >
                    {appTitle}
                </Heading>
            </div>
            {extraContent}
            <div className={styles["header-contents"]}>
                {paths.length > 0 && (
                    <nav className={styles["navigation"]}>
                        <span className={styles["nav-menu"]}>
                            <FaIcon
                                icon="bars"
                                fixedWidth
                            />
                        </span>
                        <div className={styles["nav-paths"]}>
                            {paths.map(({ path, title, icon }) => (
                                <NavLink
                                    key={path}
                                    className={({ isActive }) => classNames({
                                        [styles["active-link"]]: isActive
                                    })}
                                    to={path}
                                >
                                    <Button
                                        className={styles["link-btn"]}
                                        type="ghost"
                                        faIcon={icon}
                                    >
                                        {title}
                                    </Button>
                                </NavLink>
                            ))}
                        </div>
                    </nav>
                )}
                <div className={styles["header-right-side"]}>
                    <ThemeSwitch />
                    {Object.keys(user).length > 0 ? (
                        <Dropdown items={[{
                            key: 1,
                            label: (
                                <span>
                                    <FaIcon
                                        icon={["far", "user"]}
                                        fixedWidth
                                        padded
                                    />
                                    {`${user.Name} ${user.Surname}`}
                                </span>
                            )
                        }, {
                            key: 2,
                            label: (
                                <span>
                                    <FaIcon
                                        icon="arrow-right-from-bracket"
                                        fixedWidth
                                        padded
                                    />
                                    {"Logout"}
                                </span>
                            ),
                            onClick: handleLogout
                        }]}>
                            <span className={styles["header-icon"]}>
                                <FaIcon
                                    icon="user"
                                    fixedWidth
                                />
                            </span>
                        </Dropdown>
                    ) : (
                        <span
                            className={styles["header-icon"]}
                            onClick={handleLogin}
                        >
                            <FaIcon
                                icon="arrow-right-to-bracket"
                                fixedWidth
                            />
                        </span>
                    )}
                </div>
            </div>
        </header>
    )
}
Header.propTypes = propTypes
Header.defaultProps = defaultProps

export default Header