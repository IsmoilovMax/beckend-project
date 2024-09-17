import OrderService from "../models/Order.service";
import { T } from "../libs/types/common";
import { ExtendedEqualityFn } from "react-redux";
import { ExtendedRequest } from "src/libs/types/member";


const orderService = new OrderService();

const orderController: T= {};

orderController.createOrder = async (req: ExtendedRequest, res: Response)


export default orderController;