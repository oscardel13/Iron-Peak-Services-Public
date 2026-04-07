export const BOOKING_STATUSES = [
  "QUOTE",
  "SCHEDULED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

export const PAYMENT_STATUSES = [
  "UNPAID",
  "DEPOSIT_PAID",
  "PAID",
  "REFUNDED",
];

export const MOCK_BOOKINGS = [
  {
    id: "booking-1001",
    bookingNumber: "B-1001",

    dumpsterId: "dumpster-17-2",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #2",

    customerName: "John Martinez",
    customerPhone: "(720) 555-0142",
    customerEmail: "john.martinez@example.com",

    projectType: "Garage Cleanout",
    address1: "1423 Elm Street",
    city: "Denver",
    state: "CO",
    zip: "80219",
    placement: "Driveway",
    instructions: "Place on left side near garage",

    deliveryDate: "2026-03-17",
    pickupDate: "2026-03-21",
    pickupDateUnknown: false,
    rentalDays: 4,

    basePrice: 425,
    deliveryFee: 0,
    mileageFee: 0,
    extraDaysFee: 0,
    overageFee: 0,
    total: 425,

    paymentStatus: "DEPOSIT_PAID",
    bookingStatus: "ACTIVE",

    createdAt: "2026-03-12T09:15:00.000Z",
    updatedAt: "2026-03-13T08:45:00.000Z",
  },

  {
    id: "booking-1002",
    bookingNumber: "B-1002",

    dumpsterId: "dumpster-22-1",
    dumpsterSize: 22,
    dumpsterLabel: "22 Yard Dumpster #1",

    customerName: "Sarah Nguyen",
    customerPhone: "(303) 555-0187",
    customerEmail: "sarah.nguyen@example.com",

    projectType: "Kitchen Remodel",
    address1: "7845 W 52nd Avenue",
    city: "Arvada",
    state: "CO",
    zip: "80002",
    placement: "Driveway",
    instructions: "Call when 30 minutes out",

    deliveryDate: "2026-03-18",
    pickupDate: "2026-03-25",
    pickupDateUnknown: false,
    rentalDays: 7,

    basePrice: 525,
    deliveryFee: 0,
    mileageFee: 0,
    extraDaysFee: 0,
    overageFee: 0,
    total: 525,

    paymentStatus: "UNPAID",
    bookingStatus: "SCHEDULED",

    createdAt: "2026-03-13T12:20:00.000Z",
    updatedAt: "2026-03-13T12:20:00.000Z",
  },

  {
    id: "booking-1003",
    bookingNumber: "B-1003",

    dumpsterId: "dumpster-17-1",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #1",

    customerName: "Peak Build Co.",
    customerPhone: "(303) 555-0105",
    customerEmail: "office@peakbuildco.com",

    projectType: "Roof Tear-Off",
    address1: "2138 S Broadway",
    city: "Englewood",
    state: "CO",
    zip: "80113",
    placement: "Street",
    instructions: "Permit approved",

    deliveryDate: "2026-03-19",
    pickupDate: "2026-03-24",
    pickupDateUnknown: false,
    rentalDays: 5,

    basePrice: 425,
    deliveryFee: 0,
    mileageFee: 15,
    extraDaysFee: 0,
    overageFee: 0,
    total: 440,

    paymentStatus: "PAID",
    bookingStatus: "SCHEDULED",

    createdAt: "2026-03-10T15:42:00.000Z",
    updatedAt: "2026-03-12T10:00:00.000Z",
  },

  {
    id: "booking-1004",
    bookingNumber: "B-1004",

    dumpsterId: null,
    dumpsterSize: 22,
    dumpsterLabel: null,

    customerName: "Melissa Carter",
    customerPhone: "(720) 555-0171",
    customerEmail: "melissa.carter@example.com",

    projectType: "Estate Cleanout",
    address1: "9801 E 56th Avenue",
    city: "Commerce City",
    state: "CO",
    zip: "80022",
    placement: "Driveway",
    instructions: "Needs size recommendation",

    deliveryDate: "2026-03-22",
    pickupDate: null,
    pickupDateUnknown: true,
    rentalDays: 7,

    basePrice: 525,
    deliveryFee: 0,
    mileageFee: 0,
    extraDaysFee: 0,
    overageFee: 0,
    total: 525,

    paymentStatus: "UNPAID",
    bookingStatus: "QUOTE",

    createdAt: "2026-03-13T16:05:00.000Z",
    updatedAt: "2026-03-13T16:05:00.000Z",
  },

  {
    id: "booking-1005",
    bookingNumber: "B-1005",

    dumpsterId: "dumpster-17-1",
    dumpsterSize: 17,
    dumpsterLabel: "17 Yard Dumpster #1",

    customerName: "Apex Property Services",
    customerPhone: "(303) 555-0190",
    customerEmail: "dispatch@apexpropertyservices.com",

    projectType: "Tenant Cleanup",
    address1: "4411 Federal Blvd",
    city: "Denver",
    state: "CO",
    zip: "80211",
    placement: "Alley",
    instructions: "Use alley access",

    deliveryDate: "2026-03-07",
    pickupDate: "2026-03-11",
    pickupDateUnknown: false,
    rentalDays: 4,

    basePrice: 425,
    deliveryFee: 0,
    mileageFee: 0,
    extraDaysFee: 0,
    overageFee: 65,
    total: 490,

    paymentStatus: "PAID",
    bookingStatus: "COMPLETED",

    createdAt: "2026-03-01T11:30:00.000Z",
    updatedAt: "2026-03-11T17:10:00.000Z",
  },
];