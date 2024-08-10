import PropTypes from "prop-types"
import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"

import {
    Table as NextTable,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination
} from "@nextui-org/react"

import YesNoIconRenderer from "./components/yesNoIconRenderer"

import styles from "./Table.module.css"

const columnAlign = {
    left: "left",
    right: "right",
    center: "center"
}

const propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        width: PropTypes.number,
        align: PropTypes.oneOf(Object.keys(columnAlign)),
        cellRenderer: PropTypes.string
    })),
    data: PropTypes.array,
    uniqueKey: PropTypes.string,
    cellRenderers: PropTypes.object,
    getSelectedRows: PropTypes.func,
    toolbar: PropTypes.node,
    isBulkMode: PropTypes.bool,
    rowsPerPage: PropTypes.number
}

const defaultCellRenderers = {
    yesNoRenderer: YesNoIconRenderer
}

const Table = ({
    columns = [],
    data = [],
    uniqueKey = "id",
    cellRenderers = {},
    getSelectedRows,
    toolbar,
    isBulkMode,
    rowsPerPage = 25
}) => {
    const [targetKeys, setTargetKeys] = useState(new Set())
    const [page, setPage] = useState(1);

    const renderCell = useCallback((row, colKey) => {
        let cellValue = row[colKey]
        const cellRendererName = columns.find(x => x.field === colKey)?.cellRenderer
        
        if (!cellRendererName)
            return cellValue

        const allCellRenderers = Object.assign({}, defaultCellRenderers, cellRenderers)
        const CellRenderer = allCellRenderers[cellRendererName]

        return (
            <CellRenderer
                data={row}
                value={cellValue}
            />
        )
    }, [columns, cellRenderers])

    const pages = Math.ceil(data.length / rowsPerPage)

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage
        const end = start + rowsPerPage

        return data.slice(start, end)
    }, [page, data, rowsPerPage])

    useEffect(() => {
        const keys = [...targetKeys]
        
        if (getSelectedRows)
            getSelectedRows(data.filter(row => keys.includes(row[uniqueKey])))
    }, [targetKeys, data, uniqueKey, getSelectedRows])

    return (
        <div className={styles["table-outer-wrapper"]}>
            {toolbar && (
                <div className={styles["toolbar-wrapper"]}>
                    {toolbar}
                </div>
            )}
            <NextTable
                classNames={{
                    base: "max-h-[760px] overflow-scroll"
                }}
                isHeaderSticky
                selectionMode={isBulkMode ? "multiple" : "single"}
                selectionBehavior="toggle"
                selectedKeys={targetKeys}
                onSelectionChange={setTargetKeys}
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                aria-label="Data table"
            >
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn
                            key={column.field}
                            width={column.width}
                            align={column.align}
                        >
                            {column.name}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody emptyContent="No data">
                    {items.map((item) => (
                        <TableRow key={item[uniqueKey]}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </NextTable>
        </div>
    )
}
Table.propTypes = propTypes

export default Table