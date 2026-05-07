import { EventBus } from '../../application/ports/EventBus';
import type { DomainEvent } from '../../domain/events/DomainEvent';

/**
 * Implementación en memoria de EventBus.
 * Almacena los eventos publicados para debugging, testing y observabilidad.
 * En producción, esto publicaría a un message broker real (RabbitMQ, Kafka, etc.)
 */
export class InMemoryEventBus implements EventBus {
    private publishedEvents: DomainEvent[] = [];

    async publish(events: DomainEvent[]): Promise<void> {
        this.publishedEvents.push(...events);
    }

    /**
     * Obtiene todos los eventos publicados
     * Útil para testing y verificación de eventos de dominio
     */
    getPublishedEvents(): DomainEvent[] {
        return [...this.publishedEvents];
    }

    /**
     * Obtiene los eventos publicados de un tipo específico
     * @param eventType Constructor/clase del evento a filtrar
     */
    getPublishedEventsByType<T extends DomainEvent>(
        eventType: new (...args: unknown[]) => T
    ): T[] {
        return this.publishedEvents.filter(
            (event) => event instanceof eventType
        ) as T[];
    }

    /**
     * Limpia el historial de eventos publicados
     * Útil para tests que necesitan un estado limpio
     */
    clear(): void {
        this.publishedEvents = [];
    }

    /**
     * Retorna la cantidad de eventos publicados
     */
    getEventCount(): number {
        return this.publishedEvents.length;
    }
}
