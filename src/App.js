
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
import ShowHistory from "./views/Show/ShowHistory";
import Stats from "./views/Stats/Stats";
import Test from "./views/Test/Test";


function App() {

  const tabs = [{
    aria_label: "secciones principales",
    tabs_list: [
      {
        key: "add",
        title: "Agregar",
        aria_label: "secciones de agregar",
        tabs_list: [
          {
            key: "add_product",
            title: "Producto",
            content: <AddProduct />
          },
          {
            key: "add_client",
            title: "Cliente",
            content: <AddClient />
          }
        ]
      },
      {
        key: "show",
        title: "Mostrar",
        aria_label: "secciones de mostrar",
        tabs_list: [
          {
            key: "show_products",
            title: "Productos",
            content: <ShowProducts />
          },
          {
            key: "add_client",
            title: "Clientes",
            content: <ShowClients />
          },
          {
            key: "tickets",
            title: "Tickets",
            content: <ShowTickets />
          },
          {
            key: "sells",
            title: "Ventas",
            content: <ShowSells />
          },
          {
            key: "history",
            title: "Historial",
            content: <ShowHistory />
          }
        ]
      },

      {
        key: "buy",
        title: "Comprar",
        aria_label: "seccion de comprar",
        content: <BuySection />
      },

      {
        key: "stats",
        title: "Estadisticas",
        aria_label: "seccion de estadisticas",
        content: <Stats />
      },

      {
        key: "test",
        title: "Test",
        aria_label: "seccion de test",
        content: <Test />
      },
    ]
  }]

  const CheckTab = tab => {
    if (tab.content) {
      return tab.content
    } else if (tab.tabs_list) {
      return MakeTabs(tab)
    }

    return null
  }
  const MakeTabs = tab => {
    return <Tabs
      aria-label={tab.aria_label}
      classNames={{
        tabList: "flex-wrap justify-center",
        tab: "w-auto",
        panel: "max-w-screen"
      }}
    >
      {tab.tabs_list.map(tab =>
        <Tab key={tab.key} title={tab.title} className="flex flex-col justify-center items-center">
          {CheckTab(tab)}
        </Tab>
      )}
    </Tabs>

  }


  return (
    <main className="flex flex-col justify-center items-center p-2 " >

      {tabs.map((tab, i) =>
        <div key={'tab_main_' + i} className="flex flex-col justify-center items-center">
          {CheckTab(tab)}
        </div>
      )}

      <ToastContainer />

    </main>
  );
}

export default App;
