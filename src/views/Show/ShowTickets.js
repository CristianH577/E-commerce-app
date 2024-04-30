import { useState } from "react";

import { deleteFAPI, getFAPI } from "../../libs/fastapi";

import { Accordion, AccordionItem, Spinner, Button } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

import PaginationCustom from "../../components/PaginationCustom";
import InputSearch from "../../components/InputSearch";
import ErrorBoundary from "../../components/ErrorBoundary";


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


    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)


    const getData = async (e) => {
        setLoading(true)

        var url = 'getAll'
        if (typeof e === 'object' && e.id_ticket && e.id_ticket !== '') {
            url = 'getById/' + e.id_ticket
        }

        const response = await getFAPI('tickets/' + url)
        if (response.bool && Array.isArray(response.value)) {
            setData(response.value)
        } else {
            setData([])
        }

        setLoading(false)
    }

    const cleanEmptyTickets = async () => {
        setLoading(true)
        await deleteFAPI('tickets/cleanEmptyTickets')
        await getData()
        setLoading(false)
    }
    const deleteAll = async () => {
        const confirm = window.confirm('Se van a ELIMINAR todos los TICKETS. ¿Constinuar?')
        if (confirm) {
            setLoading(true)
            await deleteFAPI('tickets/deleteAll')
            await getData()
            setLoading(false)
        }
    }

    function SellsTable({id, rows}) {
        return <Table
            aria-label={"Tabla de ventas del tiket " + id}
            selectionMode="single"
            classNames={{
                wrapper: 'border'
            }}
        >
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>

            <TableBody
                emptyContent={"Sin resultados"}
            >
                {rows.map((row, i) =>
                    <TableRow key={`${id}_row_${i}`}>
                        {columns.map(col =>
                            <TableCell key={`${id}_row_${i}_${col.key}`}>
                                {row[col.key]}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    }



    return (
        <section className="flex flex-col items-center gap-2">

            <InputSearch
                name={'id_ticket'}
                label={'ID Ticket'}
                onSubmit={getData}
                loading={loading}
            />


            <div className="flex gap-3 items-center max-sm:justify-center flex-wrap px-2" >
                <Button onClick={cleanEmptyTickets} isDisabled={loading}>
                    Limpiar tickets vacios
                </Button>

                <Button onClick={deleteAll} isDisabled={loading}>
                    Eliminar todo
                </Button>
            </div>


            {loading
                ? <Spinner className="mt-8" />
                : <div className="max-w-[95vw] max-sm:overflow-x-scroll w-full mt-4">
                    <p className="text-neutral-500 text-center">Total: {data.length} tickets</p>

                    <div className=" flex flex-col gap-6 p-2 w-full min-w-[600px]">
                        {rows.length === 0
                            ? not_elemets
                            : rows.map(ticket =>
                                <Accordion key={ticket.id_ticket} isCompact variant="splitted" >
                                    <AccordionItem
                                        aria-label="Acordeon"
                                        title={<div className="flex justify-between">
                                            <p className="font-semibold">
                                                ID Ticket: {ticket.id_ticket} - ID Cliente: {ticket.id_client}
                                            </p>

                                            <p className="text-neutral-500">
                                                {ticket.date}
                                            </p>
                                        </div>}
                                        className="p-2"
                                    >

                                        {ticket.sells.length === 0
                                            ? not_elemets
                                            : <ErrorBoundary>
                                                <SellsTable
                                                    id={ticket.id_ticket}
                                                    rows={ticket.sells}
                                                />
                                            </ErrorBoundary>
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
