/**
 * Middleware de validation avec Zod
 * Valide les données de requête (body, params, query) contre un schema Zod
 * ET met à jour req[source] avec les données coerced
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  const target = req[source];
  const result = schema.safeParse(target);

  if (!result.success) {
    const zodError = result.error;
    let errors = [];
    try {
      const parsedErrors = JSON.parse(zodError.message);
      errors = Array.isArray(parsedErrors)
        ? parsedErrors.map((err) => ({
            field: err.path?.join('.') || err.path?.[0] || '',
            message: err.message,
          }))
        : [{ field: '', message: zodError.message }];
    } catch {
      errors = [{ field: '', message: zodError.message }];
    }
    
    return res.status(400).json({
      message: 'Erreur de validation',
      errors,
    });
  }

  // Remplace req[source] par les données validées et coerced
  req[source] = result.data;
  next();
};

