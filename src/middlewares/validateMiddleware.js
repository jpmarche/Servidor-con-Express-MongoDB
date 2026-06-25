const validateBody = (schema) => {
  return (req, res, next) => {
    // Valida los datos entrantes del body
    const result = schema.safeParse(req.body);

    // Si la validación fue exitosa, limpia el body
    if (result.success) {
      req.body = result.data;
      return next();
    }

    // Si falló, extrae los errores usando 'issues' o 'errors'
    const zodErrors = result.error?.issues || result.error?.errors || [];

    // Mapea los errores comprobando que el array realmente exista
    const errorDetails = zodErrors.map(err => ({
      field: err.path ? err.path.join('.') : "unknown_field",
      message: err.message || "Invalid value"
    }));

    // Respuesta al usaurio
    return res.status(400).json({ 
      success: false, 
      error: "Validation Error",
      details: errorDetails 
    });
  };
};

export {validateBody}