import PropTypes from "prop-types"

import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef
} from "react"

import Form from "@/components/form"
import Input from "@/components/input"
import TextArea from "@/components/textArea"
import Checkbox from "@/components/checkbox"

import { getPostFormData, respStatus, savePostFormData } from "@/helpers/axios/postService"

const propTypes = {
    id: PropTypes.string,
    setModalTitle: PropTypes.func
}

const inputRules = [
    { required: true, message: "This field is required!" },
    { whitespace: true, message: "This field is required!" }
]

const PostsForm = forwardRef(({
    id,
    setModalTitle
}, ref) => {
    const [form] = Form.useForm()

    const axiosSignal = useRef(null)

    const getPostData = useCallback((id) => {
        if (id !== "0")
            setModalTitle("Edit post")

        const postParams = { id }

        getPostFormData(postParams, axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    const {
                        title,
                        content,
                        isPublic
                    } = response.data

                    form.setFieldsValue({
                        title,
                        content,
                        isPublic
                    })
                }
            })
    }, [form, setModalTitle])

    const savePostData = useCallback(() => {
        return new Promise((resolve, reject) => {
            const postParams = {
                id
            }

            form.validateFields()
                .then(values => {
                    Object.keys(values).forEach(field => {
                        switch (field) {
                            default:
                                postParams[field] = values[field]
                                break
                        }
                    })

                    savePostFormData(postParams, axiosSignal.current?.signal)
                        .then(response => {
                            if (!!response && response.status === respStatus.success)
                                return resolve()
                        })
                        .finally(() => {
                            return reject()
                        })
                })
                .catch(() => {
                    return reject()
                })
        })
    }, [id, form])

    useImperativeHandle(ref, () => ({
        save: savePostData
    }), [savePostData])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        getPostData(id)

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getPostData, id])

    return (
        <Form form={form}>
            <Form.Field
                required
                name="title"
                initialValue=""
                rules={inputRules}
                label="Title"
            >
                <Input />
            </Form.Field>
            <Form.Field
                required
                name="content"
                initialValue=""
                rules={inputRules}
                label="Content"
            >
                <TextArea />
            </Form.Field>
            <Form.Field
                name="isPublic"
                initialValue={false}
                label="Is public"
                valuePropName="checked"
            >
                <Checkbox />
            </Form.Field>
        </Form>
    )
})
PostsForm.propTypes = propTypes
PostsForm.displayName = "PostsForm"

export default PostsForm