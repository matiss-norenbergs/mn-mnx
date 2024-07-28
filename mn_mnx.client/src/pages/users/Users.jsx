import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"

import Layout from '@/components/layout'
import Table from "@/components/table"
import Button from "@/components/button"
import ModalComponent from "@/components/modalComponent"
import Heading from "@/components/heading"

import UserForm from "@/shared/userForm"
import RoleRenderer from "./components/RoleRenderer"

import { deleteUserData, getUserListData, respStatus } from "@/helpers/axios/userService"

const columns = [
    {
        field: "select",
        name: "",
        width: 30
    },
    {
        field: "name",
        name: "Name",
        width: 100
    },
    {
        field: "surname",
        name: "Surname",
        width: 150
    },
    {
        field: "email",
        name: "Email",
        width: 170
    },
    {
        field: "createdAt",
        name: "Created at",
        width: 200,
        align: "center"
    },
    {
        field: "role",
        name: "Role",
        width: 100,
        cellRenderer: "roleRenderer"
    }
]

const cellRenderers = {
    roleRenderer: RoleRenderer
}

const Users = () => {
    const [data, setData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDataLoading, setIsDataLoading] = useState(false)

    const userFormModalElementRef = useRef(null)
    const axiosCancelToken = useRef(null)

    const isRowSelected = selectedRows.length === 1

    const getUsers = useCallback(() => {
        setIsDataLoading(true)

        getUserListData(axiosCancelToken.current.token)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    setData(response.data)
                }
            })
            .catch(() => {
                setData([])
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [axiosCancelToken])

    const handleCreateClick = useCallback(() => {
        userFormModalElementRef.current?.open()
    }, [])

    const handleEditClick = useCallback(() => {
        if (!isRowSelected)
            return

        userFormModalElementRef.current?.open({ objectId: selectedRows[0].id })
    }, [selectedRows, isRowSelected])

    const handleDeleteClick = useCallback(() => {
        if (!isRowSelected)
            return

        setIsDataLoading(true)

        const postParams = {
            id: selectedRows[0].id
        }

        deleteUserData(postParams, axiosCancelToken.current.token)
            .then(response => {
                if (!!response && response.status === 204) {
                    getUsers()
                }
            })
            .catch(() => {
                setIsDataLoading(false)
            })
    }, [isRowSelected, selectedRows, getUsers])

    useEffect(() => {
        axiosCancelToken.current = axios.CancelToken.source()

        getUsers()
    }, [getUsers])

    useEffect(() => {
        return () => axiosCancelToken.current?.cancel
    }, [])

    const toolbar = (
        <>
            <Button.Group disabled={isDataLoading}>
                <Button
                    type="primary"
                    onClick={handleCreateClick}
                    faIcon="plus"
                >
                    {"Create"}
                </Button>
                <Button
                    onClick={handleEditClick}
                    disabled={!isRowSelected}
                    faIcon="edit"
                >
                    {"Edit"}
                </Button>
                <Button
                    onClick={handleDeleteClick}
                    disabled={!isRowSelected}
                    faIcon="trash-alt"
                >
                    {"Delete"}
                </Button>
            </Button.Group>
            <Button.Spacer />
            <Button
                onClick={getUsers}
                disabled={isDataLoading}
                faIcon="sync"
            >
                {"Refresh"}
            </Button>
        </>
    )

    return (
        <Layout>
            <Heading
                level={3}
                center
            >
                {"Users"}
            </Heading>
            <Table
                toolbar={toolbar}
                columns={columns}
                data={data}
                getSelectedRows={setSelectedRows}
                cellRenderers={cellRenderers}
            />
            <ModalComponent
                ref={userFormModalElementRef}
                component={<UserForm />}
                title="Create user"
                confirmText="Save"
                onConfirm={getUsers}
                width={500}
            />
        </Layout>
    )
}

export default Users