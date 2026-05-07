import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateOrder } from '../../../application/usesCases/CreateOrder';
import { AddItemToOrder } from '../../../application/usesCases/AddItemToOrder';
import { fold } from '../../../shared/Result';
import {
    CreateOrderDTO,
    AddItemToOrderDTO,
} from '../../../application/dto';
import {
    ValidationError,
    NotFoundError,
    ConflictError,
    InfraError,
} from '../../../application/errors';

export interface AddItemPayload {
    productId: string;
    productName: string;
    quantity: number;
    currencyCode: string;
}

export class OrdersController {
    constructor(
        private readonly createOrderUseCase: CreateOrder,
        private readonly addItemToOrderUseCase: AddItemToOrder
    ) {}

    /**
     * Registra las rutas del controlador en la instancia de Fastify
     */
    register(fastify: FastifyInstance): void {
        fastify.post<{ Body: CreateOrderDTO }>(
            '/orders',
            async (request, reply) => this.createOrder(request, reply)
        );

        fastify.post<{
            Params: { orderId: string };
            Body: AddItemPayload;
        }>('/orders/:orderId/items', async (request, reply) =>
            this.addItemToOrder(request, reply)
        );
    }

    /**
     * POST /orders
     * Crea una nueva orden
     */
    private async createOrder(
        request: FastifyRequest<{ Body: CreateOrderDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        const dto: CreateOrderDTO = {
            orderId: request.body.orderId,
        };

        const result = await this.createOrderUseCase.execute(dto);

        fold(
            result,
            (error) => this.handleError(error, reply),
            (successData) => {
                reply.code(201).send({
                    success: true,
                    data: successData,
                });
            }
        );
    }

    /**
     * POST /orders/:orderId/items
     * Añade un item a una orden existente
     */
    private async addItemToOrder(
        request: FastifyRequest<{ Params: { orderId: string }; Body: AddItemPayload }>,
        reply: FastifyReply
    ): Promise<void> {
        const dto: AddItemToOrderDTO = {
            orderId: request.params.orderId,
            productId: request.body.productId,
            productName: request.body.productName,
            quantity: request.body.quantity,
            currencyCode: request.body.currencyCode,
        };

        const result = await this.addItemToOrderUseCase.execute(dto);

        fold(
            result,
            (error) => this.handleError(error, reply),
            (successData) => {
                reply.code(200).send({
                    success: true,
                    data: successData,
                });
            }
        );
    }

    /**
     * Maneja los errores de aplicación y los convierte en respuestas HTTP
     */
    private handleError(error: unknown, reply: FastifyReply): void {
        if (error instanceof ValidationError) {
            reply.code(400).send({
                success: false,
                error: {
                    type: 'validation_error',
                    message: error.message,
                },
            });
            return;
        }

        if (error instanceof NotFoundError) {
            reply.code(404).send({
                success: false,
                error: {
                    type: 'not_found_error',
                    message: error.message,
                },
            });
            return;
        }

        if (error instanceof ConflictError) {
            reply.code(409).send({
                success: false,
                error: {
                    type: 'conflict_error',
                    message: error.message,
                },
            });
            return;
        }

        if (error instanceof InfraError) {
            reply.code(500).send({
                success: false,
                error: {
                    type: 'infra_error',
                    message: error.message,
                },
            });
            return;
        }

        reply.code(500).send({
            success: false,
            error: {
                type: 'unknown_error',
                message: 'Error desconocido en el servidor',
            },
        });
    }
}
