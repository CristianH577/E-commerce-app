
import { useEffect, useState } from "react";

import { Spinner } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";

import ErrorBoundary from "../../../components/ErrorBoundary";


function StatTabContent({ data, loading, urlArray }) {
    const [keyRow, setKeyRow] = useState(false)

    const columns_all = [
        {
            key: "id_product",
            label: "ID Producto",
        },
        {
            key: "category_product",
            label: "Categoria",
        },
        {
            key: "name_product",
            label: "Nombre",
        },

        {
            key: "id_client",
            label: "ID cliente",
        },
        {
            key: "category_client",
            label: "Categoria",
        },
        {
            key: "name_client",
            label: "Nombre",
        },

        {
            key: "id_ticket",
            label: "ID ticket",
        },

        {
            key: "quantity",
            label: "Cantidad",
        },
        {
            key: "income",
            label: "Ingreso",
        },

        {
            key: "buys",
            label: "Compras",
        },
        {
            key: "spent",
            label: "Gastado",
        },

        {
            key: "total",
            label: "Total",
        },

        {
            key: "of",
            label: "De",
        },
        {
            key: "value",
            label: "Valor",
        },

        {
            key: "time",
            label: "Tiempo",
        },
        {
            key: "frequency",
            label: "Frecuencia",
        },
    ]

    const columns = {
        means: columns_all.filter(col => ['of', 'value'].includes(col.key)),

        products: {
            all: {
                tops: columns_all.filter(col => ['id_product', 'category_product', 'name_product', 'quantity', 'income'].includes(col.key)),
            },
            category: {
                tops: columns_all.filter(col => ['id_product', 'name_product', 'quantity', 'income'].includes(col.key)),
            }
        },
        clients: {
            all: {
                tops: columns_all.filter(col => ['id_client', 'category_client', 'name_client', 'buys', 'spent'].includes(col.key)),
            },
            category: {
                tops: columns_all.filter(col => ['id_client', 'name_client', 'buys', 'spent'].includes(col.key)),
            }
        },
        tickets: {
            tops: columns_all.filter(col => ['id_ticket', 'total'].includes(col.key)),
        },
        sells: {
            frequency: columns_all.filter(col => ['time', 'frequency'].includes(col.key))
        },
    }
    const keys = {
        means: 'of',
        products: 'id_product',
        clients: 'id_client',
        tickets: 'id_ticket',
        sells: {
            frequency: 'time',
        },
    }
    const titles = {
        means: "Promedios",

        products: {
            more: "Mas vendidos",
            less: "Menos vendidos",
            most: "Mayores ingresos",
            fewest: "Menores ingresos",
        },
        clients: {
            more: "Mas frecuentes",
            less: "Menos frecuentes",
            most: "Mas gastaron",
            fewest: "Menos gastaron",
        },
        tickets: {
            more: "Mas altos",
            less: "Mas bajos",
        },
        sells: {}
    }

    const getColumns = () => {
        var cols = false

        // reviso del final hacia el principio urlArray
        let aux = false
        for (let i = urlArray.length - 1; i > 0; i--) {
            const key = urlArray[i]
            if (columns[key]) aux = columns[key]
            if (Array.isArray(aux)) {
                cols = aux
                break
            }
        }

        if (!cols) {
            // reviso de principio a fin urlArray
            let aux = false
            for (const e of urlArray) {
                if (aux) {
                    if (aux[e]) aux = aux[e]
                } else {
                    aux = columns[e]
                }

                if (!aux) break
                if (Array.isArray(aux)) {
                    cols = aux
                    break
                }
            }
        }

        if (cols) return cols
        return columns_all
    }
    const getKey = () => {
        var new_keyRow = false

        // reviso del final hacia el principio urlArray
        let aux = false
        for (let i = urlArray.length - 1; i > 0; i--) {
            const key = urlArray[i]
            if (keys[key]) aux = keys[key]
            if (typeof key === 'string') {
                new_keyRow = aux
                break
            }
        }

        if (!new_keyRow) {
            // reviso de principio a fin urlArray
            let aux = false
            for (const e of urlArray) {
                if (aux) {
                    if (aux[e]) aux = aux[e]
                } else {
                    aux = keys[e]
                }

                if (!aux) break
                if (typeof aux === 'string') {
                    new_keyRow = aux
                    break
                }
            }
        }

        if (new_keyRow) setKeyRow(new_keyRow)
    }

    const renderCell = (item, col) => {
        const val = item[col] || ''

        switch (col) {
            case "income":
            case "spent":
            case "total":
                return <p>
                    ${val}
                </p>

            default:
                return <p>
                    {val}
                </p>
        }
    }

    function TablesContent({ tables }) {
        return tables.map(table =>
            keyRow && <Table
                key={table.key}
                aria-label={"tabla de " + titles[table.key] || titles[urlArray[0]][table.key] || ''}
                className="max-w-[95vw]"
                topContent={
                    (titles[table.key] || titles[urlArray[0]][table.key]) && (
                        <h1 className="text-center font-semibold">
                            {titles[table.key] || titles[urlArray[0]][table.key]}
                        </h1>
                    )}
                selectionMode="single"
            >
                <TableHeader columns={getColumns()}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>

                <TableBody
                    items={table.rows}
                    emptyContent={!loading ? "Sin resultados" : " "}
                    isLoading={loading}
                    loadingContent={<Spinner label="Loading..." />}
                >
                    {(item) => (
                        <TableRow key={item[keyRow] || ''}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )
    }


    // eslint-disable-next-line
    useEffect(getKey, [])


    return (
        <div className="flex flex-col gap-4" >

            {data.tables && (
                <ErrorBoundary>
                    <TablesContent tables={data.tables} />
                </ErrorBoundary>
            )}


            {data.tabs && (
                <Tabs
                    aria-label={"opciones de " + urlArray.join('-')}
                    variant="bordered"
                    className="dark"
                    classNames={{
                        base: "justify-center",
                        tabList: "flex-wrap justify-center",
                        tab: "w-auto",
                        panel: "max-w-screen flex flex-col items-center"
                    }}
                    isDisabled={loading}
                >
                    {data.tabs.map(tab =>
                        <Tab key={tab.key} title={tab.key}>
                            <ErrorBoundary>
                                <TablesContent tables={tab.tables} />
                            </ErrorBoundary>
                        </Tab>
                    )}
                </Tabs>
            )}

        </div>
    );
}

export default StatTabContent;
