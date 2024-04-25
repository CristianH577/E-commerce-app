
import { useEffect, useState } from "react";
import { getFAPI, imgFAPI, postFAPI } from "../../libs/fastapi";

import { Button, Input } from "@nextui-org/react";

import { Form, Formik } from "formik";

import BuyList from "./components/BuyList";

import { IoSearch } from "react-icons/io5";

import ProductsCards from "./components/ProductsCards";
import PaginationCustom from "../../components/PaginationCustom";



function BuySection() {
    const default_client = {
        id_client: 1,
        name_client: "Consumidor Final",
        category_client: "3",
    }

    const [client, setClient] = useState(default_client)
    const [data, setData] = useState([])
    const [rows, setRows] = useState([])
    const [rowImgs, setRowsImgs] = useState({})
    const [buyList, setBuyList] = useState({})
    const [loading, setLoading] = useState(false)
    const [noStock, setNoStock] = useState([])


    const getClientById = async (e) => {
        setLoading(true)
        if (e.id_client && e.id_client !== '') {
            const response = await getFAPI('clients/getById/' + e.id_client)
            if (response.bool) {
                if (response.value) {
                    setClient(response.value)
                } else {
                    setClient({
                        id_client: '',
                        name_client: 'Sin datos',
                        category_client: 'Sin datos',
                    })
                }
            }
        }
        setLoading(false)
    }
    const getAll = async () => {
        setLoading(true)
        const response = await getFAPI('products/getAll')
        if (response.bool) setData(response.value)
        setLoading(false)
    }
    const handleAddProduct = (e) => {
        const new_list = { ...buyList }

        if (buyList[e.id_product]) {
            new_list[e.id_product] = {
                ...buyList[e.id_product],
                quantity: buyList[e.id_product].quantity + 1,
                subtotal: (buyList[e.id_product].quantity + 1) * e.price,
            }
        } else {
            new_list[e.id_product] = {
                ...e,
                quantity: 1,
                subtotal: e.price,
            }
        }

        setBuyList(new_list)
    }

    const getImgs = async () => {
        if (rows.length > 0) {
            setLoading(true)

            const form_data = new FormData()
            rows.forEach(e => {
                form_data.append('ids', e.id_product)
            })

            const response = await postFAPI('products/getListImgs', form_data)

            if (response.bool) {
                const new_rowImgs = {}
                for (const id in response.value) {
                    const list = response.value[id]

                    new_rowImgs[id] = []

                    await Promise.all(
                        list.map(async name => {
                            const src = await imgFAPI(`products/getImgByName/${id}/${name}`)
                            new_rowImgs[id].push({
                                name: name,
                                src: src.value
                            })
                        })
                    )
                }
                setRowsImgs(new_rowImgs)
            }

            setLoading(false)
        }
    }

    const handleBuy = async () => {
        setLoading(true)

        if (client.id_client) {
            const list = Object.values(buyList)

            if (list.length > 0) {
                const sells = []

                list.forEach(e => {
                    const sell = {
                        id_ticket: 0,
                        id_product: e.id_product,
                        name_product: e.name_product,
                        quantity: e.quantity
                    }

                    sells.push(sell)
                })
                const check = await postFAPI('/sells/checkSells', sells)

                if (check.bool) {
                    if (check.value) {
                        setNoStock(check.value)
                    } else {
                        const addTicket = await postFAPI('/tickets/add', { id_client: client.id_client })

                        if (addTicket.bool && addTicket.value) {
                            sells.forEach(sell => sell.id_ticket = addTicket.value)

                            await postFAPI('/sells/addSells', sells)
                        }

                        setBuyList({})
                        setClient(default_client)
                    }
                }
            }

            await getAll()
        }

        setLoading(false)
    }

    const ticket_random = async () => {
        setLoading(true)
        // const response = await getFAPI('/clients/getAllIds')
        // console.log(response)

        const id_all_clients = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
        const id_index_client = Math.floor(Math.random() * (id_all_clients.length - 1) + 1)
        const id_client = id_all_clients[id_index_client]

        await getClientById({ id_client: id_client })

        // const response = await getFAPI('/products/getAllIds')
        // console.log(response)

        const id_all_products = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]

        const ticket_length = Math.floor(Math.random() * (6) + 1)
        const new_list = {}

        const ids_left = [...id_all_products]
        while (Object.keys(new_list).length < ticket_length) {
            const id_index = Math.floor(Math.random() * (ids_left.length - 1) + 1)
            const id = ids_left[id_index]
            ids_left.splice(id_index, 1)


            if (id > 0 && !Object.keys(new_list).includes(id)) {
                const p = data.find(e => e.id_product === id)

                var quantity = 0
                do {
                    quantity = Math.floor(Math.random() * (20) + 1)
                } while (quantity < 1 && quantity > p.stock);

                new_list[id] = {
                    ...p,
                    quantity: quantity,
                    subtotal: (quantity * p.price).toFixed(2),
                }
            }
        }

        setBuyList(new_list)

        setLoading(false)
    }



    useEffect(() => {
        getAll()
    }, [])
    useEffect(() => {
        getImgs()
        // eslint-disable-next-line
    }, [rows])



    return (
        <section className="flex flex-col justify-center items-center">

            {/* client */}
            <div className="flex max-sm:flex-col gap-2 items-center">
                <Formik
                    initialValues={{
                        id_client: client.id_client,
                    }}
                    onSubmit={values => getClientById(values)}
                >
                    {({ handleChange }) => (
                        <Form className="flex gap-4 items-center" >
                            <Input
                                type='number'
                                name="id_client"
                                label='ID Cliente'
                                className="w-32"
                                defaultValue={client.id_client}
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

                <div className="flex gap-2 max-sm:flex-col">
                    <Input
                        label='ID'
                        className="hidden"
                        value={client.id_client}
                        readOnly
                    />
                    <Input
                        label='Nombre'
                        value={client.name_client}
                        readOnly
                    />
                    <Input
                        label='Categoria'
                        value={client.category_client}
                        readOnly
                    />
                </div>
            </div>

            {/* ticket */}
            <BuyList
                buyList={buyList}
                setBuyList={setBuyList}
                client={client}
                loading={loading}
                handleBuy={handleBuy}
                rowImgs={rowImgs}
                noStock={noStock}
            />

            <div className="flex gap-2">
                <Button onClick={ticket_random} isDisabled={loading}>
                    Compra Aleatoria
                </Button>
            </div>


            {/* products list */}
            <p className="text-neutral-500 text-center mt-4">Total: {data.length} productos</p>
            <ProductsCards
                products={rows}
                productsImgs={rowImgs}
                loading={loading}
                handleAddProduct={handleAddProduct}
            />


            <PaginationCustom
                data={data}
                setRows={setRows}
                className={"flex w-full justify-center mt-4"}
            />

        </section>
    );
}

export default BuySection;
