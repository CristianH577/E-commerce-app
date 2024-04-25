
import { Tabs, Tab } from "@nextui-org/react";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddProduct from "./views/Add/AddProduct";
import AddClient from "./views/Add/AddClient";
import ShowProducts from "./views/Show/ShowProducts";
import ShowClients from "./views/Show/ShowClients";
import BuySection from "./views/Buy/BuySection";
import ShowTickets from "./views/Show/ShowTickets";
import ShowSells from "./views/Show/ShowSells";
import Stats from "./views/Stats/Stats";


function App() {

  return (
    <main className="flex flex-col justify-center items-center p-2" >

      <Tabs
        aria-label="Secciones"
        classNames={{
          tabList: "flex-wrap justify-center",
          tab: "w-auto",
          panel: "max-w-screen"
        }}
      >

        <Tab key="add" title="Agregar" className="flex flex-col justify-center items-center">
          <Tabs
            aria-label="Agregar"
            classNames={{
              tabList: "flex-wrap justify-center",
              tab: "w-auto",
              panel: "max-w-screen"
            }}
          >
            <Tab key="add_product" title="Agregar producto">
              <AddProduct />
            </Tab>

            <Tab key="add_client" title="Agregar cliente">
              <AddClient />
            </Tab>
          </Tabs>
        </Tab>


        <Tab key="show" title="Mostrar" className="flex flex-col justify-center items-center">
          <Tabs
            aria-label="items"
            classNames={{
              tabList: "flex-wrap justify-center",
              tab: "w-auto",
              panel: "max-w-screen"
            }}
          >
            <Tab key="show_products" title="Productos" className="">
              <ShowProducts />
            </Tab>

            <Tab key="show_clients" title="Clientes">
              <ShowClients />
            </Tab>

            <Tab key="tickets" title="Tickets">
              <ShowTickets />
            </Tab>

            <Tab key="sells" title="Ventas">
              <ShowSells />
            </Tab>
          </Tabs>
        </Tab>


        <Tab key="buy" title="Comprar" >
          <BuySection />
        </Tab>


        <Tab key="stats" title="Estadisticas" >
          <Stats />
        </Tab>


      </Tabs>

      <ToastContainer />

    </main>
  );
}

export default App;
