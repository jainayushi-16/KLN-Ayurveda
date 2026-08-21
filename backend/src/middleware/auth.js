const { verifyAccessToken } = require("../utils/jwt");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const prisma = require("../config/prisma");

const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, "Authentication required. Please sign in.");
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
      throw new ApiError(401, "Invalid or expired access token.");
    }

    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { addresses: true },
      });
    } catch (dbErr) {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      throw new ApiError(401, "Authenticated user account no longer exists in database.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, "Invalid authentication credentials.");
  }
});

module.exports = { authenticate };
