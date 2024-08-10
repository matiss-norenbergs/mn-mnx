import PropTypes from "prop-types"

import {
    useState
} from "react"

import {
    Input as NextInput
} from "@nextui-org/react"

import FaIcon from "../faIcon"

//import styles from "./Input.module.css"

const propTypes = {
    type: PropTypes.string,
    allowClear: PropTypes.bool
}

const Input = ({
    type,
    allowClear = false,
    ...rest
}) => {
    const [isVisible, setIsVisible] = useState(false)

    const isPassword = type === "password"

    const handleVisibiltyChange = () => setIsVisible(prevValue => !prevValue)

    return (
        <NextInput
            variant="bordered"
            labelPlacement="outside"
            isClearable={allowClear}
            endContent={
                isPassword ? (
                    <button
                        className="focus:outline-none"
                        type="button"
                        onClick={handleVisibiltyChange}
                        aria-label="toggle password visibility"
                    >
                        <FaIcon
                            className="text-1xl text-default-400 pointer-events-none"
                            icon={["fas", isVisible ? "eye" : "eye-slash"]}
                            fixedWidth
                        />
                    </button>
                ) : null
            }
            type={isPassword && isVisible ? "text" : type}
            {...rest}
        />
    )
}
Input.propTypes = propTypes

export default Input