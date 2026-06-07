import { Font, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { toWords } from "number-to-words";

Font.register({
    family: "Roboto",
    fonts: [
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Regular.ttf" },
        { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Bold.ttf", fontWeight: "bold" },
    ],
});

type Stop = { type: string; city: string; state: string; zip: string; datetime: string, datetime2: string };
type Item = { description: string; notes: string; quantity: number; cost: number; stops: Stop[] };

export type DynamicAdjustment = {
    id: string;
    description: string;
    type: "addition" | "deduction";
    amountCents: number;
};

export type InvoicePayload = {
    id: string;
    load_number: string;
    load_number_label?: string;
    date: string;
    timezone: string;
    carrier: { name: string; address: string; address2: string; phone: string; email: string };
    broker: { name: string; address: string; address2: string; phone: string; email: string };
    items: Item[];
    color?: string;
    secondaryColor?: string;
    adjustments?: DynamicAdjustment[];
};

function formatPhoneNumber(phoneStr: string): string {
    if (!phoneStr) return "";
    const cleaned = phoneStr.replace(/[^\d+]/g, "");
    if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    if (cleaned.startsWith("+")) {
        const mainPart = cleaned.slice(-10);
        const countryCode = cleaned.slice(0, -10);
        if (mainPart.length === 10) {
            return `${countryCode} (${mainPart.slice(0, 3)}) ${mainPart.slice(3, 6)}-${mainPart.slice(6)}`;
        }
    }
    return phoneStr;
}

function toLocalDate(isoString: string, tz: string) {
    return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(isoString));
}

export const InvoiceDocument = ({ payload }: { payload: InvoicePayload }) => {
    const primary = `#${payload.color || "134A9E"}`;
    const secondary = `#${payload.secondaryColor || "134A9E"}`;

    const styles = StyleSheet.create({
        page: {
            paddingTop: 58,
            paddingBottom: 58,
            paddingLeft: 44,
            paddingRight: 46,
            fontFamily: "Helvetica",
            fontSize: 9,
            lineHeight: 1.4,
        },
        label: { fontWeight: "bold", fontSize: 10 },
        labelBig: { fontWeight: "bold", fontSize: 12, lineHeight: 1.5 },
        title: { fontSize: 28, color: primary, fontWeight: "normal" },
        table: { display: "flex", flexDirection: "column" },
        tableHeader: { flexDirection: "row", backgroundColor: secondary, color: "#fff", padding: 5 },
        tableRow: { flexDirection: "row", padding: 5, paddingBottom: 10, borderBottomWidth: 0.5, borderColor: "#555555" },
        cell: { flex: 6 },
    });

    const itemsTotal = payload.items.reduce((sum, item) => sum + item.cost * item.quantity, 0);
    
    const dynamicAdjustmentsTotal = (payload.adjustments || []).reduce((sum, adj) => {
        const amountDollars = adj.amountCents / 100;
        return adj.type === "addition" ? sum + amountDollars : sum - amountDollars;
    }, 0);

    const total = itemsTotal + dynamicAdjustmentsTotal;
    
    const dollars = Math.floor(total);
    const cents = Math.round((total - dollars) * 100);

    let totalInWords = toWords(dollars);
    if (cents > 0) {
        totalInWords += ` and ${cents.toString().padStart(2, "0")} cents`;
    }
    totalInWords = totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1);
    
    const formattedCarrierPhone = formatPhoneNumber(payload.carrier.phone);
    const loadNumberLabel = payload.load_number_label?.trim() || "Load";

    return (
        <Page size="A4" style={styles.page}>
            {/* Upper Frame */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{payload.carrier.name}</Text>
                    <Text>{payload.carrier.address}</Text>
                    <Text>{payload.carrier.address2}</Text>
                    <Text>{formattedCarrierPhone}</Text>
                    <Text>{payload.carrier.email}</Text>

                    <View style={{ marginTop: 55 }}>
                        <Text style={{ fontSize: 10 }}>Bill To</Text>
                        <Text style={styles.labelBig}>{payload.broker.name}</Text>
                        <Text>{payload.broker.address}</Text>
                        <Text>{payload.broker.address2}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={styles.title}>Invoice</Text>
                    <Text style={{ fontSize: 12, marginTop: 25, fontWeight: "bold" }}># {payload.id}</Text>
                    <Text style={{ marginTop: 25, fontWeight: "bold" }}>Rate</Text>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                        ${itemsTotal.toFixed(2)}
                    </Text>

                    <View style={{ marginTop: 25, width: 200, alignSelf: "flex-end" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 }}>
                            <Text style={{ width: 100, textAlign: "right" }}>Invoice Date:</Text>
                            <Text>{toLocalDate(payload.date, payload.timezone)}</Text>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 }}>
                            <Text style={{ width: 100, textAlign: "right" }}>{loadNumberLabel}:</Text>
                            <Text>{payload.load_number}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Table Frame */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={{ flex: 2 }}>#</Text>
                    <Text style={{ flex: 30 }}>Description</Text>
                    <Text style={{ flex: 3 }}>Qty</Text>
                    <Text style={styles.cell}>Rate</Text>
                    <Text style={styles.cell}>Amount</Text>
                </View>

                {payload.items.map((item, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={{ flex: 2 }}>{idx + 1}</Text>
                        
                        {/* Clear, isolated vertical box for text hierarchy */}
                        <View style={{ flex: 30, flexDirection: "column" }}>
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>{item.description}</Text>
                            
                            {item.notes ? (
                                <Text style={{ color: "#333333", marginTop: 2 }}>{item.notes}</Text>
                            ) : null}

                            {item.stops.map((stop, sIdx) => (
                                <View key={sIdx} style={{ marginTop: 4 }}>
                                    <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                                        {stop.type}
                                        {stop.datetime ? ` - ${new Date(stop.datetime).toLocaleDateString("en-US")}` : ""}
                                        {stop.datetime2 ? ` - ${new Date(stop.datetime2).toLocaleDateString("en-US")}` : ""}
                                    </Text>
                                    <Text style={{ fontSize: 8, color: "#444444" }}>
                                        {stop.city}{stop.state ? `, ${stop.state}` : ""}{stop.zip ? `, ${stop.zip}` : ""}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={{ flex: 3 }}>{item.quantity}</Text>
                        <Text style={styles.cell}>${item.cost.toFixed(2)}</Text>
                        <Text style={styles.cell}>${(item.cost * item.quantity).toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Total Balance Block */}
            <View style={{ marginTop: 10, width: 225, alignSelf: "flex-end" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, paddingRight: 5 }}>
                    <Text style={{ width: 120, textAlign: "right" }}>Sub Total</Text>
                    <Text>${itemsTotal.toFixed(2)}</Text>
                </View>

                {payload.adjustments && payload.adjustments.map((adj) => {
                    const displayAmount = adj.amountCents / 100;
                    const isAddition = adj.type === "addition";
                    return (
                        <View key={adj.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, paddingRight: 5 }}>
                            <Text style={{ width: 120, textAlign: "right" }}>{adj.description}</Text>
                            <Text>{isAddition ? "+ " : "- "}${displayAmount.toFixed(2)}</Text>
                        </View>
                    );
                })}

                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3, backgroundColor: "#f0f0f0", paddingVertical: 10, paddingRight: 5 }}>
                    <Text style={{ width: 120, textAlign: "right", fontWeight: "bold", fontSize: 10 }}>Total</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 10 }}>${total.toFixed(2)}</Text>
                </View>

                <Text style={{ marginTop: 5, fontWeight: "bold", color: "#444444", textAlign: "right", fontSize: 8 }}>
                    (USD) {totalInWords}
                </Text>
            </View>

            {/* Invoice Legal Footnote */}
            <View style={{ marginTop: 25 }}>
                <Text style={{ fontSize: 10, color: "#444444", fontWeight: "bold" }}>Notes</Text>
                <Text style={{ fontSize: 8, color: "#444444", marginTop: 2 }}>
                    All checks will be made payable to {payload.carrier.name}.
                </Text>
                <Text style={{ fontSize: 8, color: "#444444" }}>
                    If you have questions about this bill, please use the following contact information:
                </Text>
                <Text style={{ fontSize: 8, color: "#444444" }}>
                    {formattedCarrierPhone} or {payload.carrier.email}
                </Text>
                <Text style={{ fontSize: 8, color: "#444444", marginTop: 4 }}>
                    Thank you for your trust.
                </Text>
            </View>
        </Page>
    );
};