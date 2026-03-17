type Booking = {
  id: string;
  dumpsterId: string | null;
  dumpsterSize: number;
  dumpsterLabel: string | null;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  service: {
    type: "dumpster-rental";
    projectType: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    placement?: string;
    instructions?: string;
  };
  schedule: {
    deliveryDate: string;
    pickupDate: string;
    rentalDays: number;
  };
  pricing: {
    basePrice: number;
    deliveryFee: number;
    mileageFee: number;
    extraDaysFee: number;
    overageFee: number;
    total: number;
  };
  paymentStatus: "unpaid" | "deposit_paid" | "paid" | "refunded";
  bookingStatus: "quote" | "scheduled" | "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};