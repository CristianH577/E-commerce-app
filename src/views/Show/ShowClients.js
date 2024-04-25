import { useState } from "react";

import { Button, Input, Link, Spinner } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import { Form, Formik } from "formik";


import { deleteFAPI, getFAPI, putFAPI } from "../../libs/fastapi";


import { IoSearch } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import PaginationCustom from "../../components/PaginationCustom";



function ShowProducts() {

    const columns = [
        {
            key: "id_client",
            label: "ID",
        },
        {
            key: "name_client",
            label: "Nombre",
        },
        {
            key: "category_client",
            label: "Categoria",
        },
        {
            key: "date",
            label: "Actualizacion",
        },
        {
            key: "actions",
            label: "",
        },
    ]

    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)

    const getById = async (e) => {
        setLoading(true)
        if (e.id_client && e.id_client !== '') {
            const response = await getFAPI('clients/getById/' + e.id_client)
            if (response.bool) setData([response.value])
        }
        setLoading(false)
    }
    const getAll = async () => {
        setLoading(true)
        const response = await getFAPI('clients/getAll')
        if (response.bool) setData(response.value)
        setLoading(false)
    }
    const handleDelete = async id => {
        setLoading(true)
        await deleteFAPI('clients/delete/' + id)
        getAll()
        setLoading(false)
    }
    const handleUpdate = async e => {
        setLoading(true)
        const response = await putFAPI('clients/update', e)
        if (response.bool) getAll()

        handleClean()
    }

    const handleClean = () => {
        document.querySelector('#form_update_client').reset()

        setEdit(false)
        setLoading(false)

        if (window.location.hash) window.location.hash = ""
    }

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'actions':
                return <div className="flex gap-2 max-sm:flex-col">
                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-danger"
                        isDisabled={loading}
                        onClick={() => handleDelete(item.id_client)}
                    >
                        <MdDeleteOutline size={25} />
                    </Button>

                    <Button
                        isIconOnly
                        className="bg-transparent hover:text-primary "
                        href="#update_client"
                        as={Link}
                        onClick={() => {
                            if (!loading) {
                                setEdit(false)

                                setTimeout(() => {
                                    setEdit(item)
                                }, 300)
                            }
                        }}
                    >
                        <CiEdit size={25} />
                    </Button>
                </div>
            case 'date':
                return <div className="min-w-36 ">
                    {item[columnKey]}
                </div>

            default:
                return <div>
                    {item[columnKey]}
                </div>
        }
    }



    return (
        <div className="flex flex-col items-center">

            <div className="flex gap-4 items-center justify-center max-sm:flex-col" >
                <Formik
                    initialValues={{
                        id_client: false,
                    }}
                    onSubmit={values => getById(values)}
                >
                    {({ handleChange }) => (
                        <Form className="flex gap-4 items-center" >
                            <Input
                                type='number'
                                name="id_client"
                                label='ID Cliente'
                                size="sm"
                                className="w-40"
                                endContent={
                                    <button type="submit" className="hover:text-warning" disabled={loading} >
                                        <IoSearch size={28} />
                                    </button>
                                }
                                onChange={handleChange}
                            />
                        </Form>
                    )}
                </Formik>

                <Button onClick={getAll} isDisabled={loading}>
                    Todos los clientes
                </Button>
            </div>


            <div id="update_client">
                {edit && (
                    <Formik
                        initialValues={{ ...edit }}
                        onSubmit={values => handleUpdate(values)}
                        onReset={handleClean}
                    >
                        {({ handleChange, values }) => (
                            <Form className="flex flex-col gap-4 mt-4 bg-content3 p-2 rounded-lg max-w-[95vw]" id="form_update_client">
                                <Input
                                    name="name_client"
                                    label='Nombre'
                                    defaultValue={values.name_client}
                                    onChange={handleChange}
                                />

                                <Input
                                    name="category_client"
                                    label='Categoria'
                                    defaultValue={values.category_client}
                                    onChange={handleChange}
                                />

                                <div className="flex max-sm:flex-col gap-2 justify-center">
                                    <Button type="submit" isDisabled={loading}>
                                        Actualizar
                                    </Button>

                                    <Button type="reset" isDisabled={loading} >
                                        Cancelar
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>


            <Table
                aria-label="Tabla de clientes"
                className="mt-8 max-w-[95vw]"
                topContent={<p className="text-neutral-500">Total: {data.length} clientes</p>}
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
                    {(item) => (
                        <TableRow key={item.id_client}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

        </div >
    );
}

export default ShowProducts;
