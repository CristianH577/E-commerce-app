
import { useState } from "react";
import { getFAPI } from "../../../libs/fastapi";

import { Button, Spinner } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/react";


function StatsProducts({ panel_content_className }) {

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
            key: "quantity",
            label: "Cantidad",
        },
        {
            key: "income",
            label: "Ingreso",
        },
    ]
    const columns = {
        productsAll: columns_all,
        productsCategory: columns_all.filter(col => !['category_product'].includes(col.key)),
    }

    const titles = {
        more: "Mas vendidos",
        less: "Menos vendidos",
        most: "Mayores ingresos",
        fewest: "Menores ingresos",
    }


    const [data, setData] = useState(false)
    const [showing, setShowing] = useState(false)
    const [loading, setLoading] = useState(false)


    const productsAll = async () => {
        setLoading(true)
        const response = await getFAPI('stats/productsAll')
        if (response.bool) setData(response.value)
        setLoading(false)
        setShowing('productsAll')
    }
    const productsCategory = async () => {
        setLoading(true)
        const response = await getFAPI('stats/productsCategory')
        if (response.bool) setData(response.value)
        setLoading(false)
        setShowing('productsCategory')
    }

    const renderCell = (item, col) => {
        switch (col) {
            case "income":
                return <p>
                    ${item[col]}
                </p>


            default:
                return <p>
                    {item[col]}
                </p>
        }
    }


    return (
        <div className="flex flex-col gap-4">
            <div className={panel_content_className}>
                <Button
                    color={showing === 'productsAll' ? 'success' : 'default'}
                    onClick={productsAll}
                    isDisabled={loading}
                >
                    Todos
                </Button>

                <Button
                    color={showing === 'productsCategory' ? 'success' : 'default'}
                    onClick={productsCategory}
                    isDisabled={loading}
                >
                    Por categoria
                </Button>
            </div>


            <Tabs
                aria-label="estadisticas de productos"
                variant="bordered"
                className="dark"
                classNames={{
                    base: "justify-center",
                    tabList: "flex-wrap justify-center",
                    tab: "w-auto",
                    panel: "max-w-screen flex flex-col gap-4",
                }}
            >
                {Object.keys(data).map(tab =>
                    <Tab key={tab} title={tab} >
                        {Object.keys(data[tab]).map(key =>
                            <Table
                                key={tab + "_" + key}
                                aria-label={"Tabla de estadisticas: " + titles[key]}
                                className="max-w-[95vw]"
                                topContent={<h1 className="text-center font-semibold">{titles[key]}</h1>}
                                selectionMode="single"
                            >
                                <TableHeader columns={columns[showing]}>
                                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                </TableHeader>
                                <TableBody
                                    items={data[tab][key]}
                                    emptyContent={!loading ? "Sin resultados" : " "}
                                    isLoading={loading}
                                    loadingContent={<Spinner label="Loading..." />}
                                >
                                    {(item) => (
                                        <TableRow key={item.id_product}>
                                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </Tab>
                )}
            </Tabs>

        </div>
    );
}

export default StatsProducts;
