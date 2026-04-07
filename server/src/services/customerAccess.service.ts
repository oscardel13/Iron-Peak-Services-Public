const { prisma } = require('../libs/prisma.js');
import crypto from 'crypto';

const getBookingByToken = async (token: string) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const accessToken = await prisma.customerAccessToken.findUnique({
    where: { tokenHash },
    include: {
      booking: {
        include: {
          dumpster: true,
          addons: {
            include: {
              addon: true,
            },
          },
          notes: {
            where: { visibility: 'CUSTOMER' },
          },
        },
      },
    },
  });

  if (!accessToken || accessToken.expiresAt < new Date() || accessToken.revokedAt) {
    return null;
  }

  // Update last used
  await prisma.customerAccessToken.update({
    where: { tokenHash },
    data: { lastUsedAt: new Date() },
  });

  return accessToken.booking;
};

const updateBookingByToken = async (token: string, data: any) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const accessToken = await prisma.customerAccessToken.findUnique({
    where: { tokenHash },
  });

  if (!accessToken || accessToken.expiresAt < new Date() || accessToken.revokedAt) {
    return null;
  }

  // TODO: Limit what fields can be updated by customer
  const booking = await prisma.booking.update({
    where: { id: accessToken.bookingId },
    data,
    include: {
      dumpster: true,
      addons: {
        include: {
          addon: true,
        },
      },
    },
  });

  return booking;
};

const addNoteByToken = async (token: string, data: any) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const accessToken = await prisma.customerAccessToken.findUnique({
    where: { tokenHash },
  });

  if (!accessToken || accessToken.expiresAt < new Date() || accessToken.revokedAt) {
    throw new Error('Invalid or expired token');
  }

  return await prisma.bookingNote.create({
    data: {
      bookingId: accessToken.bookingId,
      visibility: 'CUSTOMER',
      body: data.body,
    },
  });
};

module.exports = {
  getBookingByToken,
  updateBookingByToken,
  addNoteByToken,
};
