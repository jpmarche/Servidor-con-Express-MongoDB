const validateBody = (schema) => {
  return (req, res, next) => {
    // 1. Validamos los datos entrantes del body
    const result = schema.safeParse(req.body);

    // 2. Si la validación fue un éxito, limpiamos el body y avanzamos
    if (result.success) {
      req.body = result.data;
      return next();
    }

    // 3. Si falló, extraemos los errores de forma ultra segura usando 'issues' o 'errors'
    const zodErrors = result.error?.issues || result.error?.errors || [];

    // 4. Mapeamos los errores comprobando que el array realmente exista
    const errorDetails = zodErrors.map(err => ({
      field: err.path ? err.path.join('.') : "unknown_field",
      message: err.message || "Invalid value"
    }));

    // 5. Respondemos al cliente con JSON limpio
    return res.status(400).json({ 
      success: false, 
      error: "Validation Error",
      details: errorDetails 
    });
  };
};

export {validateBody}