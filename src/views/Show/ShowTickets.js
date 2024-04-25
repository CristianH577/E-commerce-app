import { useState } from "react";

import { deleteFAPI, getFAPI } from "../../libs/fastapi";

import { Accordion, AccordionItem, Spinner, Button, Input } from "@nextui-org/react";

import { Form, Formik } from "formik";

import PaginationCustom from "../../components/PaginationCustom";

import { IoSearch } from "react-icons/io5";


function ShowTickets() {

    const columns = [
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

    const not_elemets = <div className="text-center text-lg text-neutral-500 p-2">
        Sin resultados
    </div>

    const tickets_header = <div className="flex justify-evenly bg-content2 p-2 rounded-lg text-sm w-full">
        {columns.map(col =>
            <div key={col.key} className="font-semibold w-full text-center">
                {col.label}
            </div>
        )}
    </div>


    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)


    const getById = async (e) => {
        setLoading(true)
        if (e.id_ticket && e.id_ticket !== '') {
            const response = await getFAPI('tickets/getById/' + e.id_ticket)
            if (response.bool) setData(response.value)
        }
        setLoading(false)
    }
    const getAll = async () => {
        setLoading(true)
        const response = await getFAPI('tickets/getAll')
        if (response.bool) setData(response.value)
        setLoading(false)
    }
    const cleanEmptyTickets = async () => {
        setLoading(true)
        await deleteFAPI('tickets/cleanEmptyTickets')
        await getAll()
        setLoading(false)
    }
    const deleteAll = async () => {
        const confirm = window.confirm('Se van a ELIMINAR todos los TICKETS. ¿Constinuar?')
        if (confirm) {
            setLoading(true)
            await deleteFAPI('tickets/deleteAll')
            await getAll()
            setLoading(false)
        }
    }



    return (
        <section>
            <div className="flex gap-3 items-center max-sm:justify-center flex-wrap px-2" >
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
                                name="id_ticket"
                                label='ID Ticket'
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
                    Todos los tickets
                </Button>

                <Button onClick={cleanEmptyTickets} isDisabled={loading}>
                    Limpiar tickets vacios
                </Button>

                <Button onClick={deleteAll} isDisabled={loading}>
                    Eliminar todo
                </Button>
            </div>



            {loading
                ? <Spinner className="mt-8" />

                : <div className="max-w-[95vw] max-sm:overflow-x-scroll w-full mt-8">
                    {<p className="text-neutral-500 text-center">Total: {data.length} tickets</p>}
                    <div className=" flex flex-col gap-6 p-2 w-full min-w-[600px]">
                        {rows.length === 0
                            ? not_elemets
                            : rows.map(e =>
                                <Accordion key={e.id_ticket} isCompact variant="splitted" >
                                    <AccordionItem
                                        aria-label="Acordeon"
                                        title={<div className="flex justify-between">
                                            <p className="font-semibold">
                                                ID Ticket: {e.id_ticket} - ID Cliente: {e.id_client}
                                            </p>

                                            <p className="text-neutral-500">
                                                {e.date}
                                            </p>
                                        </div>}
                                        className="p-2"
                                    >

                                        {e.sells.length === 0
                                            ? not_elemets
                                            : <div>
                                                {tickets_header}

                                                {e.sells.map((s, i) =>
                                                    <div
                                                        key={`${e.id_ticket}_row_${i}`}
                                                        className="flex hover:bg-content2 p-1 rounded-lg"
                                                    >
                                                        {columns.map(col =>
                                                            <div
                                                                key={`${e.id_ticket}_row_${i}_${col.key}`}
                                                                className="w-full text-center"
                                                            >
                                                                {s[col.key]}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        }
                                    </AccordionItem>
                                </Accordion>
                            )
                        }
                    </div>
                </div>
            }

            <PaginationCustom
                data={data}
                setRows={setRows}
                className={"flex w-full justify-center mt-4"}
            />

        </section>
    );
}

export default ShowTickets;
