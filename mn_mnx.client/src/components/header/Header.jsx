import PropTypes from "prop-types"
import classNames from "classnames"

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
    useCallback,
    useEffect,
    useRef
} from "react"

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar
} from "@nextui-org/react"

import FaIcon from "../faIcon"
import ModalComponent from "../modalComponent"

import UserForm from "@/shared/userForm"

import { logoutUser, respStatus } from "@/helpers/axios/publicService"

import styles from "./Header.module.css"

const propTypes = {
    paths: PropTypes.array,
    extraContent: PropTypes.node,
    appTitle: PropTypes.string,
    showLogo: PropTypes.bool,
    logoutUser: PropTypes.func,
    showRouteIcons: PropTypes.bool
}

const Header = ({
    paths,
    appTitle,
    showLogo = true,
    showRouteIcons = false
}) => {
    const axiosSignal = useRef(null)
    const userLoginFormRef = useRef(null)

    const user = useSelector((state) => state.user)
    const navigate = useNavigate()

    const handleLogin = useCallback(() => {
        userLoginFormRef.current?.open()
    }, [])

    const handleLogout = useCallback(() => {
        logoutUser(axiosSignal.current?.signal)
            .then(response => {
                if (response.status === respStatus.success)
                    navigate(0)
            })
    }, [navigate])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [])

    return (
        <Navbar
            className="bg-secondary"
            maxWidth="full"
        >
            {showLogo && (
                <NavbarBrand>
                    <p className={classNames(
                        "font-bold text-4xl text-default",
                        styles["app-title"]
                    )}>
                        {appTitle}
                    </p>
                </NavbarBrand>
            )}
            <NavbarContent>
                {paths?.map(({ path, title, icon }) => (
                    <NavbarItem
                        key={path}
                    >
                        <Link
                            className="text-default text-md"
                            href={path}
                        >
                            <FaIcon
                                icon={icon}
                                padded
                                isHidden={!showRouteIcons}
                            />
                            {title}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent as="div" justify="end">
                {Object.keys(user).length > 0 ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                className="transition-transform"
                                color="secondary"
                                isBordered
                                as="button"
                                size="md"
                                name={`${user.Name} ${user.Surname}`}
                                src={user?.ProfileImage}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                        >
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <Link
                                    className="font-semibold"
                                    href={`/profile/${user.Id}`}
                                >
                                    <FaIcon
                                        icon="user"
                                        padded
                                    />
                                    {`${user.Name} ${user.Surname}`}
                                </Link>
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger">
                                <Link onPress={handleLogout}>
                                    <FaIcon
                                        icon="arrow-right-from-bracket"
                                        padded
                                    />
                                    Log Out
                                </Link>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : (
                    <NavbarItem>
                        <Link
                            className={classNames(
                                "text-default text-md",
                                styles["login-btn"]
                            )}
                            onPress={handleLogin}
                        >
                            <FaIcon
                                icon="arrow-right-to-bracket"
                                padded
                            />
                            Login
                        </Link>
                    </NavbarItem>
                )}
            </NavbarContent>
            <ModalComponent
                ref={userLoginFormRef}
                component={<UserForm formState={1} />}
                title="Login"
                confirmText="Login"
                onModalConfirm="login"
                width={500}
                disableEsc
            />
        </Navbar>
    )
}
Header.propTypes = propTypes

export default Header