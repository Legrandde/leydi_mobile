import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCartStore } from "../store/cartStore";

type PayMethod = "wave" | "orange" | "cash" | "card";

const PAY_METHODS: {
  key: PayMethod; label: string; sub: string;
  logoLabel: string; logoBg: string; logoColor: string;
}[] = [
  { key: "wave",   label: "Wave",                    sub: "Paiement mobile instantané", logoLabel: "https://i.pinimg.com/736x/36/af/0d/36af0df12dae18c18ae511e1bcf2ade6.jpg",  logoBg: "#1a56db", logoColor: "#fff"    },
  { key: "orange", label: "Orange Money",             sub: "Paiement mobile Orange",     logoLabel: "https://i.pinimg.com/736x/d4/0a/ae/d40aaed93de5fb669b845167963c6d9f.jpg", logoBg: "#ff6900", logoColor: "#fff"    },
  { key: "cash",   label: "Paiement à la livraison", sub: "Espèces à la réception",     logoLabel: "https://i.pinimg.com/736x/f9/f7/2a/f9f72a859cc3b5c99335752592e586c9.jpg", logoBg: "#e8f5e9", logoColor: "#2e7d32" },
];

const GREEN = "#2e7d32";
const DISCOUNT_RATE = 0.10;

const btnLabel: Record<PayMethod, string> = {
  wave:   "Payer avec Wave",
  orange: "Payer avec Orange Money",
  cash:   "Payer à la livraison",
  card:   "Payer par carte",
};

// ─── Steps ───────────────────────────────────────────────────────────────────

function Steps({ current }: { current: 1 | 2 | 3 }) {
  const steps = ["Panier", "Paiement", "Suivi"];
  return (
    <View style={styles.steps}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <View key={label} style={styles.stepItem}>
            {i > 0 && <View style={[styles.stepLine, done && styles.stepLineDone]} />}
            <View style={[styles.stepDot, (done || active) && styles.stepDotActive]}>
              {done
                ? <Feather name="check" size={11} color="#fff" />
                : <Text style={[styles.stepNum, (done || active) && { color: "#fff" }]}>{n}</Text>
              }
            </View>
            <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── Success ─────────────────────────────────────────────────────────────────

function SuccessScreen({ onTrack }: { onTrack: () => void }) {
  return (
    <View style={styles.successWrap}>
      <View style={styles.successIcon}>
        <Feather name="check-circle" size={32} color={GREEN} />
      </View>
      <Text style={styles.successTitle}>Commande confirmée !</Text>
      <Text style={styles.successSub}>
        Votre commande <Text style={{ fontWeight: "600" }}>#LK-2024</Text> a bien été reçue.{"\n"}
        Livraison estimée : <Text style={{ fontWeight: "600" }}>aujourd'hui entre 14h–17h</Text>.
      </Text>
      <TouchableOpacity style={styles.trackBtn} onPress={onTrack} activeOpacity={0.8}>
        <Feather name="map-pin" size={14} color="#fff" />
        <Text style={styles.trackBtnText}>Suivre ma commande</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function OrderConfirmScreen() {
  const router = useRouter();
  const { cart, inc, dec, remove, clear, totalPrice } = useCartStore();
  const [payMethod, setPayMethod] = useState<PayMethod>("wave");
  const [confirmed, setConfirmed] = useState(false);

  const items    = Object.values(cart);
  const subtotal = totalPrice();
  const discount = Math.round(subtotal * DISCOUNT_RATE);
  const total    = subtotal - discount;
  const fmt      = (n: number) => n.toLocaleString("fr-FR") + " F";

  const handleConfirm = () => {
    setConfirmed(true);
    clear(); // vide le panier après confirmation
  };

  // ── Success state ──
  if (confirmed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topbar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(single)/ProductsList')}
          >
            <Feather name="arrow-left" size={17} color="#555" />
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Confirmation</Text>
        </View>
        <Steps current={3} />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <SuccessScreen onTrack={() => router.push("/(single)/traking")} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Panier vide (edge case) ──
  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Feather name="arrow-left" size={17} color="#555" />
          </TouchableOpacity>
          <Text style={styles.topbarTitle}>Confirmation</Text>
        </View>
        <View style={styles.emptyWrap}>
          <Feather name="shopping-bag" size={36} color="#ccc" />
          <Text style={styles.emptyText}>Votre panier est vide</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()}>
            <Text style={styles.emptyBtnText}>Retour au marché</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Top bar ── */}
      <View style={styles.topbar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={17} color="#555" />
        </TouchableOpacity>
        <Text style={styles.topbarTitle}>Confirmation</Text>
      </View>

      <Steps current={2} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.body}
      >
        {/* ── Récapitulatif ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <Feather name="shopping-bag" size={14} color={GREEN} />
              <Text style={styles.sectionTitle}>
                Votre commande ({items.length} article{items.length > 1 ? "s" : ""})
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.editLink}>Modifier</Text>
            </TouchableOpacity>
          </View>

          {items.map((item, idx) => (
            <View
              key={item.id}
              style={[styles.itemRow, idx === items.length - 1 && { borderBottomWidth: 0 }]}
            >
              <View style={[styles.itemEmoji, { backgroundColor: item.emojiColor }]}>
                <Image source={{uri: item.emoji }} style={{ width: 30, height:30 }} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.cultivateur} · {item.localite}</Text>
              </View>
              {/* Contrôle quantité inline */}
              <View style={styles.itemQtyCtrl}>
                <TouchableOpacity style={styles.smallQtyBtn} onPress={() => dec(item.id)}>
                  <Text style={styles.smallQtyText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.smallQtyNum}>{item.qty}</Text>
                <TouchableOpacity style={styles.smallQtyBtn} onPress={() => inc(item.id)}>
                  <Text style={styles.smallQtyText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "flex-end", minWidth: 64 }}>
                <Text style={styles.itemPrice}>{fmt(item.price * item.qty)}</Text>
                <Text style={styles.itemUnit}>{item.price.toLocaleString("fr-FR")} F/{item.unit}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Adresse livraison ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <Feather name="map-pin" size={14} color={GREEN} />
              <Text style={styles.sectionTitle}>Livraison</Text>
            </View>
            <TouchableOpacity><Text style={styles.editLink}>Changer</Text></TouchableOpacity>
          </View>
          <View style={styles.addrBody}>
            <Feather name="home" size={15} color="#aaa" style={{ marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addrName}>Alhassane · +221 77 000 00 00</Text>
              <Text style={styles.addrDetail}>
                Cité Keur Gorgui, Dakar{"\n"}Devant la boulangerie jaune
              </Text>
            </View>
          </View>
        </View>

        {/* ── Mode de paiement ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHead}>
            <View style={styles.sectionTitleRow}>
              <Feather name="credit-card" size={14} color={GREEN} />
              <Text style={styles.sectionTitle}>Mode de paiement</Text>
            </View>
          </View>
          {PAY_METHODS.map((m, idx) => {
            const selected = payMethod === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.payRow, idx === PAY_METHODS.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => setPayMethod(m.key)}
                activeOpacity={0.7}
              >
                <View style={[styles.payLogo]}>
                  <Image source={{uri: m.logoLabel}} style={{width:42, height:40, borderRadius: 20}} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payName}>{m.label}</Text>
                  <Text style={styles.paySub}>{m.sub}</Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Totaux ── */}
        <View style={styles.totalsCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalVal}>{fmt(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Livraison</Text>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>Gratuit</Text>
            </View>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Réduction (10 %)</Text>
            <Text style={[styles.totalVal, { color: GREEN }]}>−{fmt(discount)}</Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabelBold}>Total</Text>
            <Text style={styles.totalValBold}>{fmt(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Footer CTA ── */}
      <View style={styles.footer}>
        <View style={styles.footerTop}>
          <Text style={styles.footerLabel}>Total à payer</Text>
          <Text style={styles.footerAmount}>{fmt(total)}</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleConfirm}
          activeOpacity={0.82}
        >
          <Feather name="lock" size={15} color="#fff" />
          <Text style={styles.payBtnText}>{btnLabel[payMethod]}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fa" },

  topbar: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: "#ebebeb",
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: "#f5f5f5", borderWidth: 0.5, borderColor: "#e8e8e8",
    alignItems: "center", justifyContent: "center",
  },
  topbarTitle: { fontSize: 17, fontWeight: "600", color: "#111" },

  steps: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: "#ebebeb",
  },
  stepItem:      { flexDirection: "row", alignItems: "center", flex: 1 },
  stepLine:      { flex: 1, height: 0.5, backgroundColor: "#e0e0e0", marginHorizontal: 6 },
  stepLineDone:  { backgroundColor: GREEN },
  stepDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#f0f0f0", borderWidth: 0.5, borderColor: "#ddd",
    alignItems: "center", justifyContent: "center",
  },
  stepDotActive: { backgroundColor: GREEN, borderColor: GREEN },
  stepNum:        { fontSize: 11, fontWeight: "600", color: "#aaa" },
  stepLabel:      { fontSize: 11, fontWeight: "500", color: "#bbb", marginLeft: 5 },
  stepLabelActive:{ color: GREEN },

  body: { padding: 12, gap: 10, paddingBottom: 140 },

  sectionCard: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: 0.5, borderColor: "#ebebeb", overflow: "hidden",
  },
  sectionHead: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0",
  },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle:    { fontSize: 13, fontWeight: "600", color: "#111" },
  editLink:        { fontSize: 11, color: GREEN },

  // Items
  itemRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5",
  },
  itemEmoji: {
    width: 34, height: 34, borderRadius: 9,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  itemName:  { fontSize: 13, fontWeight: "600", color: "#111" },
  itemSub:   { fontSize: 11, color: "#aaa", marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: "600", color: "#111" },
  itemUnit:  { fontSize: 10, color: "#bbb", marginTop: 2 },

  // Inline qty ctrl on confirm
  itemQtyCtrl: { flexDirection: "row", alignItems: "center", gap: 6 },
  smallQtyBtn: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: "#f5f5f5", alignItems: "center", justifyContent: "center",
  },
  smallQtyText: { fontSize: 14, color: "#444", lineHeight: 18 },
  smallQtyNum:  { fontSize: 12, fontWeight: "600", color: "#111", minWidth: 12, textAlign: "center" },

  // Address
  addrBody:   { flexDirection: "row", gap: 10, padding: 14 },
  addrName:   { fontSize: 13, fontWeight: "600", color: "#111" },
  addrDetail: { fontSize: 12, color: "#888", marginTop: 3, lineHeight: 18 },

  // Payment
  payRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5",
  },
  payLogo: {
    width: 42, height: 30, borderRadius: 8,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
    borderWidth: 0.5, borderColor: "rgba(0,0,0,0.06)",
  },
  payLogoText: { fontSize: 11, fontWeight: "700" },
  payName:     { fontSize: 13, fontWeight: "600", color: "#111" },
  paySub:      { fontSize: 11, color: "#aaa", marginTop: 2 },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 1, borderColor: "#ddd",
    alignItems: "center", justifyContent: "center",
  },
  radioSelected: { borderWidth: 2, borderColor: GREEN },
  radioDot:      { width: 9, height: 9, borderRadius: 5, backgroundColor: GREEN },

  // Totals
  totalsCard: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: 0.5, borderColor: "#ebebeb", padding: 14,
  },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 10,
  },
  totalRowFinal: {
    marginBottom: 0, paddingTop: 10,
    borderTopWidth: 0.5, borderTopColor: "#f0f0f0",
  },
  totalLabel:     { fontSize: 13, color: "#888" },
  totalLabelBold: { fontSize: 14, fontWeight: "600", color: "#111" },
  totalVal:       { fontSize: 13, color: "#111" },
  totalValBold:   { fontSize: 16, fontWeight: "700", color: "#111" },
  freeBadge: {
    backgroundColor: "#e8f5e9", borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  freeBadgeText: { fontSize: 11, fontWeight: "600", color: GREEN },

  // Footer
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", borderTopWidth: 0.5,
    borderTopColor: "#ebebeb", padding: 16, paddingBottom: 28, gap: 10,
  },
  footerTop:    { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  footerLabel:  { fontSize: 12, color: "#aaa" },
  footerAmount: { fontSize: 20, fontWeight: "700", color: "#111" },
  payBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: GREEN, borderRadius: 12, padding: 14,
  },
  payBtnText: { fontSize: 15, fontWeight: "600", color: "#fff" },

  // Empty
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { fontSize: 14, color: "#bbb", fontWeight: "500" },
  emptyBtn:  { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: GREEN, borderRadius: 10 },
  emptyBtnText: { fontSize: 13, fontWeight: "600", color: "#fff" },

  // Success
  successWrap: {
    backgroundColor: "#fff", borderRadius: 14,
    borderWidth: 0.5, borderColor: "#ebebeb",
    padding: 40, alignItems: "center", gap: 12,
  },
  successIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: "#e8f5e9", alignItems: "center", justifyContent: "center",
  },
  successTitle: { fontSize: 18, fontWeight: "700", color: "#111", textAlign: "center" },
  successSub:   { fontSize: 13, color: "#888", textAlign: "center", lineHeight: 20 },
  trackBtn: {
    flexDirection: "row", alignItems: "center", gap: 7,
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 11,
    backgroundColor: GREEN, borderRadius: 10,
  },
  trackBtnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
});