import OrderService from "../models/Order.service";
import { T } from "../libs/types/common";
import { Request, Response } from "express";
import { ExtendedRequest } from "../libs/types/member";
import { HttpCode } from "../libs/utils/Errors";
import Errors from "../libs/utils/Errors";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService();

const orderController: T = {};

orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("ERROR, createOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;
    const inquiry: OrderInquiry = {
      page: Number(page),
      limit: Number(limit),
      orderStatus: orderStatus as OrderStatus,
    };

    console.log("inquiry:", inquiry);
    const result = await orderService.getMyOrders(req.member, inquiry);

    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("ERROR, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("updateOrder");
        const input: OrderUpdateInput = req.body;
        const result = await orderService.updateOrder(req.member, input)
        res.status(HttpCode.CREATED).json(result)
    }catch(err){
        console.log("ERROR, updateOrder:", err)
        if(err instanceof Errors) res.status(err.code).json(err)
        else res.status(Errors.standard.code).json(Errors.standard)
    }
}

export default orderController;
