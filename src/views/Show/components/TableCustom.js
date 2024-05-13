import { useState } from "react";

import { Spinner } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import PaginationCustom from "../../../components/PaginationCustom";


function TableCustom({ label, data, columns, id_row, renderCell, loading, rows, setRows }) {

    const [sort, setSort] = useState('')

    const bottomContent = <PaginationCustom
        data={data}
        setRows={setRows}
        className={"flex justify-center mt-4 w-fit sm:w-full"}
        sort={sort}
        setSort={setSort}
    />

    return (
        loading
            ? <Spinner className="mt-8" />
            : <Table
                aria-label={"Tabla de " + label}
                className="mt-4 max-w-[95vw]"

                selectionMode="single"
                sortDescriptor={sort}
                onSortChange={setSort}

                topContent={
                    <p className="text-neutral-500">
                        Total: {data.length} {label}
                    </p>
                }
                bottomContent={bottomContent}
            >
                <TableHeader columns={columns} >
                    {(column) =>
                        <TableColumn
                            key={column.key}
                            allowsSorting={!['actions', 'img'].includes(column.key)}
                        >
                            {column.label}
                        </TableColumn>
                    }
                </TableHeader>

                <TableBody
                    emptyContent={"Sin resultados"}
                >
                    {rows.map((row, i) =>
                        <TableRow key={row[id_row] + "_" + i}>
                            {columns.map(col =>
                                <TableCell key={`${row[id_row]}_${col.key}`}>
                                    {renderCell(row, col.key)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
    );
}

export default TableCustom;
