import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from "./order-item.model";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                })),
            },
            {
                include: [{model: OrderItemModel}],
            }
        );
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        const items = orderModel.items.map((item) => {
            return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        });

        return new Order(orderModel.id, orderModel.customer_id, items);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll();
        const orders = orderModels.map((orderModel) => {
            const items = orderModel.items.map((item) => {
                return new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            });
            return new Order(orderModel.id, orderModel.customer_id, items);
        });
        return orders;
    }

    async update(entity: Order): Promise<void> {
        return Promise.resolve(undefined);
    }
}
