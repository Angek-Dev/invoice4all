export const examplePayload = {
  id: "782",
  load_number: "AJK-908121",
  load_number_label: "Shipment",
  date: "2025-06-06T15:30:00.000Z",
  timezone: "America/Los_Angeles",
  carrier: {
    name: "Three Stars Transport Inc",
    address: "1427 Evanwood Ave",
    address2: "La Puente, California 91744",
    phone: "(619) 939-6319",
    email: "threestars039@gmail.com",
  },
  broker: {
    name: "CH GLOBAL",
    address: "9731 SIEMPRE VIVA RD",
    address2: "San Diego, California 92154",
    phone: "(619) 555-1234",
    email: "broker@example.com",
  },
  adjustments: [
    {
      id: "mock-adj-1",
      description: "Detention at pickup location",
      type: "addition",
      amountCents: 15000
    },
    {
      id: "mock-adj-2",
      description: "QuickPay Processing Fee",
      type: "deduction",
      amountCents: 4000,
    }
  ],
  items: [
    {
      description: "Line Haul",
      notes: "",
      quantity: 1,
      cost: 2000,
      stops: [
        {
          type: "Pickup",
          city: "Sohnen Enterprise - 9043 Siempre Viva Rd, San Diego, CA",
          state: "CA",
          zip: "92154",
          datetime: "2025-06-05T08:00:00.000Z",
          datetime2: "",
        },
        {
          type: "Delivery",
          city: "Z & S 26 Electronics, Inc. - 967 E. 11th Street, Los Angeles, CA",
          state: "CA",
          zip: "90021",
          datetime: "2025-06-06T14:00:00.000Z",
          datetime2: "",
        },
      ],
    },
  ],
  color: "134A9E",
  secondaryColor: "134A9E",
};

export const examplePayloadJson = JSON.stringify(examplePayload, null, 2);
