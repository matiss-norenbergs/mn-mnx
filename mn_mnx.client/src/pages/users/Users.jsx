import { useCallback, useEffect, useRef, useState } from "react"

import {
    Button,
    ButtonGroup,
    Spacer
} from "@nextui-org/react"

import Table from "@/components/table"
import ModalComponent from "@/components/modalComponent"
import FaIcon from "@/components/faIcon"

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
        field: "birthday",
        name: "Birthday",
        width: 200
    },
    {
        field: "role",
        name: "Role",
        width: 100,
        cellRenderer: "roleRenderer"
    },
    {
        field: "createdAt",
        name: "Created at",
        width: 200,
        align: "center"
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
    const axiosSignal = useRef(null)

    const isRowSelected = selectedRows.length === 1

    const getUsers = useCallback(() => {
        setIsDataLoading(true)

        getUserListData(axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    setData(response.data)
                }
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [axiosSignal])

    const handleCreateClick = useCallback(() => {
        userFormModalElementRef.current?.open()
    }, [])

    const handleEditClick = useCallback(() => {
        if (!isRowSelected)
            return

        userFormModalElementRef.current?.open({ objectId: selectedRows[0].id })
    }, [selectedRows, isRowSelected])

    const handleDeleteClick = useCallback(() => {
        if (selectedRows.length === 0)
            return

        setIsDataLoading(true)

        const postParams = {
            ids: JSON.stringify(selectedRows.map(({ id }) => id))
        }

        deleteUserData(postParams, axiosSignal.current?.signal)
            .then(response => {
                if (!!response && response.status === respStatus.success) {
                    getUsers()
                }
            })
            .finally(() => {
                setIsDataLoading(false)
            })
    }, [selectedRows, getUsers])

    useEffect(() => {
        axiosSignal.current = new AbortController()

        getUsers()

        return () => {
            axiosSignal.current?.abort()
        }
    }, [getUsers])

    const toolbar = (
        <>
            <ButtonGroup
                size="sm"
                isDisabled={isDataLoading}
            >
                <Button
                    color="primary"
                    onPress={handleCreateClick}
                >
                    <FaIcon icon="plus" />
                    {"Create"}
                </Button>
                <Button
                    onPress={handleEditClick}
                    isDisabled={!isRowSelected}
                >
                    <FaIcon icon="edit" />
                    {"Edit"}
                </Button>
                <Button
                    onPress={handleDeleteClick}
                    isDisabled={selectedRows.length === 0}
                >
                    <FaIcon icon="trash-alt" />
                    {"Delete"}
                </Button>
            </ButtonGroup>
            <Spacer />
            <Button
                onPress={getUsers}
                size="sm"
                isDisabled={isDataLoading}
            >
                <FaIcon icon="sync" />
                {"Refresh"}
            </Button>
        </>
    )

    return (
        <div className="flex flex-col p-6">
            <Table
                toolbar={toolbar}
                columns={columns}
                data={data}
                getSelectedRows={setSelectedRows}
                cellRenderers={cellRenderers}
                isBulkMode
            />
            <ModalComponent
                ref={userFormModalElementRef}
                component={<UserForm />}
                title="Create user"
                confirmText="Save"
                onConfirm={getUsers}
                width={500}
                disableEsc
            />
        </div>
    )
}

export default Users