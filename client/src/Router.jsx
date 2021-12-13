import React from "react";
import { Switch, Route } from "react-router-dom";

import Main from "./pages/Main";
import TradeList from "./pages/TradeList";
import CategoryBar from "./components/Organism/CategoryBar";
import Register from "./pages/Register";
import ProductPage from "./pages/Product/index";
import MyItem from "./pages/MyItems";
import CategoryItems from "./pages/CategoryItems";
import ProductUpdate from "./pages/ProductUpdate";

import ErrorPage from "./pages/ErrorPage";

const Router = () => {
  return (
    <>
      <CategoryBar></CategoryBar>
      <Switch>
        <Route path="/" exact component={Main}></Route>
        <Route path="/category/:code" exact component={CategoryItems}></Route>
        <Route path="/user"></Route>
        <Route path="/tradelist" component={TradeList}></Route>
        <Route path="/register" exact component={Register}></Route>
        <Route path="/products/:id" component={ProductPage}></Route>
        <Route path="/productUpdate/:id" component={ProductUpdate} />
        <Route path="/myItems" component={MyItem}></Route>
        <Route component={ErrorPage}></Route>
      </Switch>
    </>
  );
};

export default Router;
