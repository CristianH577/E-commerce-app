
import { Button, CardHeader, Image, ScrollShadow } from "@nextui-org/react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';


import { MdAddShoppingCart } from "react-icons/md";

import unit_value from '../../../assets/files/unit_values.json'
import { ProductUnknown } from '../../../assets/icons'


function ProductsCards({ products, productsImgs, loading, handleAddProduct }) {

    return (
        <div className="gap-2 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 ">
            {products.map(e =>
                <Card
                    shadow="sm"
                    key={e.id_product}
                    className="w-sreen xs:w-[230px] sm:min-h-[420px] xl:w-[350px] xl:h-[600px]"
                >
                    <CardHeader className="overflow-visible p-2 flex justify-center w-full ">
                        {productsImgs[e.id_product]
                            ? <Swiper
                                spaceBetween={1}
                                slidesPerView={1}
                                modules={[Navigation, Mousewheel]}
                                navigation
                                mousewheel
                                className="max-xs:h-40 xs:h-40 xl:h-64"
                            >
                                {productsImgs[e.id_product].map(img =>
                                    <SwiperSlide key={img.name} className="!flex  justify-center items-center">
                                        <Image
                                            src={img.src}
                                            alt={'Imagen de ' + e.name_product}
                                            removeWrapper
                                            className="object-cover w-full bg-background"
                                        />
                                    </SwiperSlide>
                                )}
                            </Swiper>

                            : <ProductUnknown
                                alt={'Imagen de ' + e.name_product}
                                className="max-xs:h-40 xs:h-40 xl:h-64 w-full"
                            />
                        }
                    </CardHeader>

                    <CardBody className="gap-4 pb-0">
                        <div className="flex flex-col items-center text-lg gap-1">
                            <p className="capitalize break-all font-semibold text-center">
                                {e.name_product} 
                            </p>

                            <span className="rounded-full bg-content3 px-4 w-20 h-20 flex flex-col items-center justify-center">
                                <b className="">
                                    ${e.price}
                                </b>

                                <p className="text-sm text-neutral-500">
                                    {unit_value[e.category_product]
                                        ? unit_value[e.category_product].quantity_sell + unit_value[e.category_product].unit_sell
                                        : "1u"
                                    }
                                </p>
                            </span>
                        </div>


                        <div className=" h-full flex flex-col justify-between">

                            <ScrollShadow hideScrollBar className="max-h-40 sm:max-h-28 md:max-h-32 xl:max-h-28">
                                {e.description}
                            </ScrollShadow>


                            <div className="text-end">
                                <Button
                                    isIconOnly
                                    variant="light"
                                    isDisabled={loading || e.stock === 0}
                                    onClick={() => handleAddProduct(e)}
                                >
                                    <MdAddShoppingCart size={30} />
                                </Button>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="flex justify-between text-neutral-500  text-sm pt-0">
                        <p>{e.category_product}</p>
                        <p>{e.date.split("T")[0]}</p>
                    </CardFooter>
                </Card>
            )}
        </div>

    );
}

export default ProductsCards;
