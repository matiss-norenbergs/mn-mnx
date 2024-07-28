import PropTypes from "prop-types"
import classNames from "classnames"
import { useCallback, useEffect, useMemo, useState } from "react"

import SelectedRenderer from "./components/selectedRenderer"

import styles from "./Table.module.css"

const columnAlign = {
    left: "left",
    right: "right",
    center: "center"
}

const propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.number,
        align: PropTypes.oneOf(Object.keys(columnAlign)),
        cellRenderer: PropTypes.string
    })),
    data: PropTypes.array,
    rowKey: PropTypes.string,
    cellRenderers: PropTypes.object,
    getSelectedRows: PropTypes.func,
    toolbar: PropTypes.node,
    allowMultiselection: PropTypes.bool
}
const defaultProps = {
    columns: [],
    data: [],
    rowKey: "id",
    cellRenderers: {},
    allowMultiselection: false
}

const getCellRenderer = (CellRenderer, cellValue, rowData) => (
    <CellRenderer
        value={cellValue}
        data={rowData}
    />
)

const Table = ({
    columns,
    data,
    rowKey,
    cellRenderers,
    getSelectedRows,
    toolbar,
    allowMultiselection
}) => {
    const [targetKeys, setTargetKeys] = useState([])

    const handleRowClick = useCallback((id) => () => {
        setTargetKeys(prevState => {
            const currentKeys = [...prevState]

            if (currentKeys.includes(id))
                currentKeys.splice(currentKeys.indexOf(id), 1)
            else if (!allowMultiselection)
                return [id]
            else
                currentKeys.push(id)

            return currentKeys
        })
    }, [allowMultiselection])

    useEffect(() => {
        if (getSelectedRows)
            getSelectedRows(data.filter(row => targetKeys.includes(row[rowKey])))
    }, [targetKeys, data, rowKey, getSelectedRows])

    return (
        <div className={styles["table-outer-wrapper"]}>
            {toolbar && (
                <div className={styles["toolbar-wrapper"]}>
                    {toolbar}
                </div>
            )}
            <div className={styles["table-inner-wrapper"]}>
                <table className={styles["table-wrapper"]}>
                    <thead>
                        <tr>
                            {useMemo(() => {
                                return columns.map(({
                                    field,
                                    name,
                                    width,
                                    align
                                }) => (
                                    <th
                                        key={field}
                                        className={styles[align]}
                                        style={{ width }}
                                    >
                                        {name}
                                    </th>
                                ))
                            }, [columns])}
                        </tr>
                    </thead>
                    <tbody>
                        {useMemo(() => {
                            return data.map((row) => {
                                const isSelected = targetKeys.includes(row[rowKey])

                                return (
                                    <tr
                                        key={row[rowKey]}
                                        onClick={handleRowClick(row[rowKey])}
                                        className={classNames({
                                            [styles["selected"]]: isSelected
                                        })}
                                    >
                                        {columns.map(({
                                            field,
                                            name,
                                            align,
                                            cellRenderer
                                        }) => (
                                            field === "select" ? (
                                                <td
                                                    key={field}
                                                    className={classNames(
                                                        styles[columnAlign.center],
                                                        styles["select-cell"]
                                                    )}
                                                >
                                                    <SelectedRenderer selected={isSelected} />
                                                </td>
                                            ) : (
                                                <td
                                                    key={field}
                                                    className={styles[align]}
                                                    data-cell={name}
                                                >
                                                    {Object.keys(cellRenderers).includes(cellRenderer) ? (
                                                        getCellRenderer(cellRenderers[cellRenderer], row[field], row)
                                                    ) : (
                                                        row[field]
                                                    )}
                                                </td>
                                            )
                                        ))}
                                    </tr>
                                )
                            })
                        }, [cellRenderers, columns, data, handleRowClick, rowKey, targetKeys])}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
Table.propTypes = propTypes
Table.defaultProps = defaultProps

export default Table