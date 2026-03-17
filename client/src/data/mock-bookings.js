export const BOOKING_STATUSES = [
  "quote",
  "scheduled",
  "active",
  "completed",
  "cancelled",
];

export const PAYMENT_STATUSES = [
  "unpaid",
  "deposit_paid",
  "paid",
  "refunded",
];

export const MOCK_BOOKINGS = [
  {
    id: "booking-1001",
    dumpsterId: "dumpster-17-2",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #2",

    customer: {
      name: "John Martinez",
      phone: "(720) 555-0142",
      email: "john.martinez@example.com",
    },

    service: {
      type: "dumpster-rental",
      projectType: "Garage Cleanout",
      address1: "1423 Elm Street",
      city: "Denver",
      state: "CO",
      zip: "80219",
      placement: "Driveway",
      instructions: "Please place on left side of driveway near garage.",
    },

    schedule: {
      deliveryDate: "2026-03-17",
      pickupDate: "2026-03-21",
      rentalDays: 4,
    },

    pricing: {
      basePrice: 425,
      deliveryFee: 0,
      mileageFee: 0,
      extraDaysFee: 0,
      overageFee: 0,
      total: 425,
    },

    paymentStatus: "deposit_paid",
    bookingStatus: "active",

    createdAt: "2026-03-12T09:15:00.000Z",
    updatedAt: "2026-03-13T08:45:00.000Z",
  },

  {
    id: "booking-1002",
    dumpsterId: "dumpster-22-1",
    dumpsterSize: 22,
    dumpsterLabel: "22 Yard Dumpster #1",

    customer: {
      name: "Sarah Nguyen",
      phone: "(303) 555-0187",
      email: "sarah.nguyen@example.com",
    },

    service: {
      type: "dumpster-rental",
      projectType: "Kitchen Remodel",
      address1: "7845 W 52nd Avenue",
      city: "Arvada",
      state: "CO",
      zip: "80002",
      placement: "Driveway",
      instructions: "Call when 30 minutes out. Gate should be open.",
    },

    schedule: {
      deliveryDate: "2026-03-18",
      pickupDate: "2026-03-25",
      rentalDays: 7,
    },

    pricing: {
      basePrice: 525,
      deliveryFee: 0,
      mileageFee: 0,
      extraDaysFee: 0,
      overageFee: 0,
      total: 525,
    },

    paymentStatus: "unpaid",
    bookingStatus: "scheduled",

    createdAt: "2026-03-13T12:20:00.000Z",
    updatedAt: "2026-03-13T12:20:00.000Z",
  },

  {
    id: "booking-1003",
    dumpsterId: "dumpster-17-1",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #1",

    customer: {
      name: "Peak Build Co.",
      phone: "(303) 555-0105",
      email: "office@peakbuildco.com",
    },

    service: {
      type: "dumpster-rental",
      projectType: "Roof Tear-Off",
      address1: "2138 S Broadway",
      city: "Englewood",
      state: "CO",
      zip: "80113",
      placement: "Street",
      instructions: "Permit already approved. Place in front of property.",
    },

    schedule: {
      deliveryDate: "2026-03-19",
      pickupDate: "2026-03-24",
      rentalDays: 5,
    },

    pricing: {
      basePrice: 425,
      deliveryFee: 0,
      mileageFee: 15,
      extraDaysFee: 0,
      overageFee: 0,
      total: 440,
    },

    paymentStatus: "paid",
    bookingStatus: "scheduled",

    createdAt: "2026-03-10T15:42:00.000Z",
    updatedAt: "2026-03-12T10:00:00.000Z",
  },

  {
    id: "booking-1004",
    dumpsterId: null,
    dumpsterSize: 22,
    dumpsterLabel: null,

    customer: {
      name: "Melissa Carter",
      phone: "(720) 555-0171",
      email: "melissa.carter@example.com",
    },

    service: {
      type: "dumpster-rental",
      projectType: "Estate Cleanout",
      address1: "9801 E 56th Avenue",
      city: "Commerce City",
      state: "CO",
      zip: "80022",
      placement: "Driveway",
      instructions: "Need recommendation on size before confirming.",
    },

    schedule: {
      deliveryDate: "2026-03-22",
      pickupDate: "2026-03-29",
      rentalDays: 7,
    },

    pricing: {
      basePrice: 525,
      deliveryFee: 0,
      mileageFee: 0,
      extraDaysFee: 0,
      overageFee: 0,
      total: 525,
    },

    paymentStatus: "unpaid",
    bookingStatus: "quote",

    createdAt: "2026-03-13T16:05:00.000Z",
    updatedAt: "2026-03-13T16:05:00.000Z",
  },

  {
    id: "booking-1005",
    dumpsterId: "dumpster-17-1",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #1",

    customer: {
      name: "Apex Property Services",
      phone: "(303) 555-0190",
      email: "dispatch@apexpropertyservices.com",
    },

    service: {
      type: "dumpster-rental",
      projectType: "Tenant Turnover Cleanup",
      address1: "4411 Federal Blvd",
      city: "Denver",
      state: "CO",
      zip: "80211",
      placement: "Alley",
      instructions: "Use alley access behind building.",
    },

    schedule: {
      deliveryDate: "2026-03-07",
      pickupDate: "2026-03-11",
      rentalDays: 4,
    },

    pricing: {
      basePrice: 425,
      deliveryFee: 0,
      mileageFee: 0,
      extraDaysFee: 0,
      overageFee: 65,
      total: 490,
    },

    paymentStatus: "paid",
    bookingStatus: "completed",

    createdAt: "2026-03-01T11:30:00.000Z",
    updatedAt: "2026-03-11T17:10:00.000Z",
  },
];