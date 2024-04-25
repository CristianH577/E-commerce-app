import { useState } from "react";

import { deleteFAPI, getFAPI } from "../../libs/fastapi";

import { Spinner, Input, Button } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { Form, Formik } from "formik";

import PaginationCustom from "../../components/PaginationCustom";

import { IoSearch } from "react-icons/io5";
import unit_values from '../../assets/files/unit_values.json'


function ShowSells() {
    const columns = [
        {
            key: "id_ticket",
            label: "ID Ticket",
        },
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
            label: "Producto",
        },
        {
            key: "quantity",
            label: "Cantidad",
        },
    ]



    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)


    const getById = async (e) => {
        setLoading(true)
        if (e.id_product && e.id_product !== '') {
            const response = await getFAPI('sells/getById/' + e.id_product)
            if (response.bool) setData(response.value)
        } else {
            getAll()
        }
        setLoading(false)
    }
    const getAll = async () => {
        setLoading(true)
        const response = await getFAPI('sells/getAll')
        if (response.bool) setData(response.value)
        setLoading(false)
    }
    const cleanUnknownSells = async () => {
        setLoading(true)
        await deleteFAPI('sells/cleanUnknownSells')
        await getAll()
        setLoading(false)
    }
    const renderCell = (item, key) => {
        switch (key) {
            case 'quantity':
                const rule = unit_values[item.category_product] || unit_values.default
                var quantity = (item.quantity * rule.quantity_value)
                if (quantity % 1 !== 0) quantity = quantity.toFixed(1)
                const unit = rule.unit

                return <p>
                    {quantity + unit}
                </p>

            default:
                return <p>
                    {item[key]}
                </p>
        }

    }



    return (
        <section className="flex flex-col items-center ">

            <div className="flex gap-4 items-center justify-center max-sm:flex-col " >
                <Formik
                    initialValues={{
                        id_ticket: false,
                    }}
                    onSubmit={values => getById(values)}
                >
                    {({ handleChange }) => (
                        <Form className="flex gap-4 items-center" >
                            <Input
                                type='number'
                                name="id_product"
                                label='ID Producto'
                                size="sm"
                                className="w-40"
                                endContent={
                                    <button type="submit" className="hover:text-warning" disabled={loading}>
                                        <IoSearch size={28} />
                                    </button>
                                }
                                onChange={handleChange}
                            />
                        </Form>
                    )}
                </Formik>

                <Button onClick={getAll} isDisabled={loading}>
                    Todas las ventas
                </Button>
                <Button onClick={cleanUnknownSells} isDisabled={loading}>
                    Limpiar ventas desconocidas
                </Button>
            </div>


            <Table
                aria-label="Tabla de ventas"
                className="max-w-[95vw] mt-8 !w-fit"
                selectionMode="single"
                topContent={<p className="text-neutral-500">Total: {data.length} ventas</p>}
                bottomContent={
                    <PaginationCustom
                        data={data}
                        setRows={setRows}
                        className={"flex justify-center mt-4 w-fit sm:w-full"}
                    />
                }
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>

                <TableBody
                    items={rows}
                    emptyContent={!loading ? "Sin resultados" : " "}
                    isLoading={loading}
                    loadingContent={<Spinner label="Loading..." />}
                >
                    {rows.map((row, i) =>
                        <TableRow key={row.id_ticket + '_' + i}>
                            {(columnKey) => <TableCell>{renderCell(row, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </section>
    );
}

export default ShowSells;
