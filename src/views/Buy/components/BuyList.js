import { useEffect, useState } from "react";

import { Button, Image, Input, Tooltip } from "@nextui-org/react";

import { FaMinus, FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import product_unknown from '../../../assets/imgs/product_unknown.svg'
import unit_values from '../../../assets/files/unit_values.json'


function BuyList({ buyList, setBuyList, client, loading, rowImgs, handleBuy, noStock }) {

    const columns = [
        {
            key: "img",
            label: "",
        },
        {
            key: "name_product",
            label: "Nombre",
        },
        {
            key: "category_product",
            label: "Categoria",
        },
        {
            key: "price",
            label: "Precio",
        },
        {
            key: "quantity",
            label: "Cantidad",
        },
        {
            key: "subtotal",
            label: "Subtotal",
        },
        {
            key: "actions",
            label: "",
        },
    ]
    const default_total = {
        products: '',
        unities: '',
        total: ''
    }

    const [total, setTotal] = useState(default_total)

    const deleteFromList = (id) => {
        const new_list = { ...buyList }
        delete new_list[id]
        setBuyList(new_list)
    }
    const handleQuantity = (id, action) => {
        const new_list = { ...buyList }

        var add = 0
        if (action === 'plus') {
            add = 1
        } else if (action === 'minus') {
            add = -1
        }

        const new_quantity = buyList[id].quantity + add

        if (new_quantity <= 0) {
            delete new_list[id]
        } else {
            new_list[id] = {
                ...buyList[id],
                quantity: new_quantity,
                subtotal: (new_quantity * buyList[id].price).toFixed(2),
            }
        }

        setBuyList(new_list)
    }

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'actions':
                return <div className="flex gap-2 justify-center ">
                    <MdDeleteOutline
                        size={25}
                        className="hover:text-danger hover:cursor-pointer"
                        onClick={() => !loading && deleteFromList(item.id_product)}
                    />
                </div>
            case 'price':
                return <div className="text-center">
                    $ {item.price}
                </div>
            case 'quantity':
                const rule = unit_values[item.category_product] || unit_values.default
                var quantity = (item.quantity * rule.quantity_value)
                if (quantity % 1 !== 0) quantity = quantity.toFixed(1)
                const unit = rule.unit

                return <div className="flex justify-around items-center gap-1">
                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        isDisabled={loading || item.quantity === 1}
                        onClick={() => handleQuantity(item.id_product, 'minus')}
                    >
                        <FaMinus />
                    </Button>

                    <p>
                        {quantity + unit}
                    </p>


                    <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        isDisabled={loading || item.quantity >= item.stock}
                        onClick={() => handleQuantity(item.id_product, 'plus')}
                    >
                        <FaPlus />
                    </Button>

                </div>
            case 'subtotal':
                return <div className="text-center">
                    $ {item.subtotal}
                </div>
            case 'img':
                return <div className="flex justify-center">
                    <span className="w-8 h-8">
                        <Image
                            src={rowImgs[item.id_product] ? rowImgs[item.id_product][0].src : product_unknown}
                            alt={'Imagen de ' + item.name_product}
                            radius="none"
                            removeWrapper
                            className="w-full h-full object-cover"
                        />
                    </span>
                </div>

            default:
                return <div className="text-center">
                    {item[columnKey]}
                </div>
        }
    }

    const updateTotal = () => {
        var products = 0
        var unities = 0
        var total = 0

        Object.keys(buyList).forEach(key => {
            products += 1
            unities += buyList[key].quantity
            total += parseFloat(buyList[key].subtotal)
        })

        total = total.toFixed(2)

        setTotal({
            products: products,
            unities: unities,
            total: total,
        })
    }


    useEffect(updateTotal, [buyList])


    return (
        <div className="my-8" >
            <div className=" max-w-[95vw] max-md:overflow-x-scroll flex flex-col md:items-center">
                <h1 className="text-xl text-center mb-2">Lista de compras</h1>

                <div className="shadow-md p-2 rounded-xl border min-w-[700px] max-w-96 h-96 overflow-y-auto">
                    <div className="flex justify-evenly bg-content2 p-2 rounded-lg text-sm w-full">
                        {columns.map(col =>
                            <div key={col.key} className="font-semibold text-center w-full">
                                {col.label}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 mt-2 p-2 w-full">
                        {Object.values(buyList).length !== 0
                            ? Object.values(buyList).map(row =>
                                <div
                                    key={row.id_product}
                                    className={
                                        "flex justify-evenly items-center hover:bg-content2 px-1 py-2 rounded-lg "
                                        + (noStock.includes(row.id_product) && "bg-danger-50")
                                    }
                                >
                                    {columns.map(col =>
                                        <div key={col.key + '_' + row.id_product} className="w-full">
                                            {renderCell(row, col.key)}
                                        </div>
                                    )}
                                </div>
                            )
                            : <div className="text-center text-lg text-neutral-500 mt-8">
                                Sin elementos
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4 max-sm:flex-col items-center">
                <Input
                    label='Productos'
                    value={total.products}
                    readOnly
                />
                <Input
                    label='Uidades'
                    value={total.unities}
                    readOnly
                />
                <Input
                    label='Total'
                    value={total.total}
                    readOnly
                    startContent={total.total !== '' && '$'}
                />


                <Tooltip content={!client.id_client && 'Definir clieznte'} color="danger" showArrow isDisabled={client.id_client}>
                    <Button onClick={handleBuy} isDisabled={loading || !client.id_client || Object.values(buyList).length === 0}>
                        Comprar
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}

export default BuyList;
