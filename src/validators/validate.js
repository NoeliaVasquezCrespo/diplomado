function validate(schema, target = 'body') {
    return (req, res, next) => {
        const data = req[target];

        // paso 1 -> Verificar que hayan datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({error: 'No data found'});
        }

        // paso 2 -> Validar contra el schema con opciones
        const { error, value } = schema.validate(data, {
            abortEarly: false, // Para que retorne todos los errores
            stripUnknown: true // Para eliminar campos no definidos en el schema
        });

        // paso 3 -> Si hay error, retornar el error 400
        if (error) {
            return res.status(400).json({
               message: `Error de validación en ${target}`,
               errores: error.details.map(err => err.message)
            });
        }     
        
        // paso 4 -> Reemplazar el opjeto oriquinal con los datos limpios
        req[target] = value;

        // Continuamos
        next();
    }
}

export default validate;