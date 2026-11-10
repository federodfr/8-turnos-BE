import { z } from "zod"

const bookingFields = {
    clientName: z.string({error: "El nombre debe ser un texto"}).trim().min(2,"El nombre debe tener al menos dos caracteres"),
    clientEmail: z.email({error:"La descripcion debe ser un texto en formato email"}).trim().min(5, "La descripcion debe tener al menos 5 caracteres"),
    date: z.iso.date({error: "La fecha debe venir en formato YYYY-MM-DD"}),
    time: z.iso.time({error: "La hora debe venir en HH:MM"}),
    status: z.enum(["active", "inactive"], {error: "El estado solo puede ser active o inactive"}),
    services: z.array(
        z.object({
            service: z.string({error: "Por favor ingresar un ID de servicio valido"}),
            quantity: z.number({error: "Por favor ingresar una cantidad valida"})

        })
    ).optional()
}

export const createBookingSchema = z.object(bookingFields).strict();