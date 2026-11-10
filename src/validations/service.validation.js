import { z } from "zod"

const serviceFields = {
    name: z.string({error: "El nombre debe ser un texto"}).trim().min(2,"El nombre debe tener al menos dos caracteres"),
    description: z.string({error:"La descripcion debe ser un texto"}).trim().min(5, "La descripcion debe tener al menos 5 caracteres"),
    duration: z.number({error: "La duración debe ser un número"}).int("La duración debe ser un número entero").positive("La duración debe ser mayor que 0"),
    price: z.number({error: "El precio debe ser un numero"}).min(0, "El precio no puede ser negativo"),
    category: z.string({error:"La categoria debe ser un texto"}).trim().min(5, "La categoria debe tener al menos 2 caracteres"),
    available: z.boolean({error: "La dispoibilidad debe ser true o false"}).optional()
}

export const createServiceSchema = z.object(serviceFields).strict();

export const updateServiceSchema = z.object(serviceFields).partial().strict().refine(
    data => Object.keys(data).length > 0, {message: "Debe enviar al menos un campo para actualizar"}
)