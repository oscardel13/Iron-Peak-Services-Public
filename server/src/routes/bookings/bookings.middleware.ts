import type { Request, Response, NextFunction } from 'express';

// TODO customer only middleware
export const customerOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // if user is admin skip check and call next
        if (req.user?.is_admin) {
            return next();
        }

        // Get bookingId from request or params 
        const bookingId = req.params.id;

        //  Get booking from database using bookingId
        // const booking = await getBookingById(bookingId); --- IGNORE ---
        // if booking not found return 404
        // if (!booking) {
        //     return res.status(404).json({ error: 'Booking not found' });
        // }

        // Check if booking belongs to the authenticated customer
        if (req.user?.id !== bookingId) {
            return res.status(403).json({ error: 'Forbidden: You do not have access to this booking' });
        }

        // If everything is fine, call next
        next();

    }
    catch (error) {
        return res.status(403).json({ error: 'Forbidden: Customers only' });
    }
}