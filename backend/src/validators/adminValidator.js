const USER_ROLES = ["user", "admin"];
const USER_STATUSES = ["active", "inactive"];
const USER_SORT_FIELDS = ["name", "activity"];
const SORT_DIRECTIONS = ["asc", "desc"];

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

export const validateAdminUsersQuery = (req, res, next) => {
  const { page, limit, role, status, sortBy, sortDirection } = req.query;

  if (page && !isPositiveInteger(page)) {
    return res.status(422).json({
      success: false,
      message: "Page harus berupa angka positif.",
    });
  }

  if (limit && (!isPositiveInteger(limit) || Number(limit) > 100)) {
    return res.status(422).json({
      success: false,
      message: "Limit harus angka positif maksimal 100.",
    });
  }

  if (role && !USER_ROLES.includes(role)) {
    return res.status(422).json({
      success: false,
      message: "Role user tidak valid.",
    });
  }

  if (status && !USER_STATUSES.includes(status)) {
    return res.status(422).json({
      success: false,
      message: "Status user tidak valid.",
    });
  }

  if (sortBy && !USER_SORT_FIELDS.includes(sortBy)) {
    return res.status(422).json({
      success: false,
      message: "Kolom sort user tidak valid.",
    });
  }

  if (sortDirection && !SORT_DIRECTIONS.includes(sortDirection)) {
    return res.status(422).json({
      success: false,
      message: "Arah sort user tidak valid.",
    });
  }

  return next();
};

export const validateUserStatus = (req, res, next) => {
  const { status } = req.body;

  if (!USER_STATUSES.includes(status)) {
    return res.status(422).json({
      success: false,
      message: "Status user tidak valid.",
    });
  }

  return next();
};
