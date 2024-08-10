import PropTypes from "prop-types"
import Form, { FormProvider } from "rc-field-form"

import Field from "./components/field"

import styles from "./Form.module.css"

const propTypes = {
    form: PropTypes.object,
    children: PropTypes.node
}
const defaultProps = {}

const MyForm = ({
    form,
    children
}) => {
    return (
        <FormProvider>
            <Form
                className={styles["mn-form"]}
                form={form}
            >
                {children}
            </Form>
        </FormProvider>
    )
}
MyForm.propTypes = propTypes
MyForm.defaultProps = defaultProps

MyForm.useForm = Form.useForm
MyForm.Field = Field
MyForm.FormProvider = Form.FormProvider

export default MyForm