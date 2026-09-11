import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import { getMealRecipe } from "@/lib/data/mealSwapData";
import { generateConsolidatedShoppingList } from "@/lib/data/shoppingList";

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  coverPage: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  // Running Header & Footer
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#059669",
    letterSpacing: 1.5,
  },
  headerTagline: {
    fontSize: 7.5,
    color: "#6B7280",
    marginLeft: 8,
  },
  headerMeta: {
    fontSize: 7.5,
    color: "#4B5563",
    textAlign: "right",
  },
  pageFooter: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: "#6B7280",
  },
  footerPageNum: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },

  // Typography
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1.5,
    borderBottomColor: "#111827",
    paddingBottom: 4,
    marginBottom: 12,
  },
  sectionNumber: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 8,
    color: "#6B7280",
  },

  // Cover Elements
  coverHeader: {
    marginBottom: 20,
  },
  coverBadge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  coverBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
    letterSpacing: 1,
  },
  coverTitle: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    lineHeight: 1.15,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  coverSubtitle: {
    fontSize: 10,
    color: "#4B5563",
    lineHeight: 1.4,
    maxWidth: 420,
  },
  coverMetaCard: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 12,
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  coverMetaCol: {
    flexDirection: "column",
  },
  coverMetaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coverMetaValue: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  // Hero Metrics Grid
  heroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 18,
  },
  heroCard: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  heroCardHighlight: {
    width: "31%",
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  heroLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  heroValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  heroValueHighlight: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  heroSub: {
    fontSize: 7,
    color: "#6B7280",
    marginTop: 2,
  },

  // Cover Footer Callout
  coverCallout: {
    backgroundColor: "#F3F4F6",
    borderLeftWidth: 3,
    borderLeftColor: "#059669",
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  coverCalloutText: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.4,
  },

  // Card Styling
  card: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  badge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#047857",
  },

  // Data Tables
  table: {
    width: "100%",
    marginVertical: 4,
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  th: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textTransform: "uppercase",
  },
  td: {
    fontSize: 8,
    color: "#1F2937",
  },
  tdBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  colExercise: { width: "38%" },
  colSetsReps: { width: "18%" },
  colRest: { width: "16%" },
  colRpe: { width: "14%" },
  colNotes: { width: "14%" },

  // Exercise Cues inside table
  cueBox: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    borderRadius: 3,
    padding: 4,
    marginTop: 3,
    marginBottom: 4,
    marginLeft: 6,
    marginRight: 6,
  },
  cueText: {
    fontSize: 7,
    color: "#4B5563",
    lineHeight: 1.3,
  },
  cueBold: {
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },

  // Nutrition Meal Styling
  mealMacroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  macroItem: {
    alignItems: "center",
  },
  macroItemLabel: {
    fontSize: 6.5,
    color: "#6B7280",
    fontFamily: "Helvetica-Bold",
  },
  macroItemVal: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  recipeSection: {
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  subHeading: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    width: 8,
    fontSize: 8,
    color: "#059669",
  },
  bulletText: {
    fontSize: 7.5,
    color: "#4B5563",
    flex: 1,
    lineHeight: 1.3,
  },

  // Disclaimer Box
  disclaimerBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
  },
  disclaimerTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#92400E",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  disclaimerText: {
    fontSize: 7,
    color: "#78350F",
    lineHeight: 1.35,
  },

  // Shopping List Section
  shoppingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  shoppingCol: {
    width: "48%",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  shoppingColHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 4,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  shoppingItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 1.5,
    marginRight: 5,
    marginTop: 1.5,
  },
  shoppingItemName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#1F2937",
  },
  shoppingItemPortion: {
    fontSize: 7,
    color: "#6B7280",
    marginLeft: 3,
  },
});

interface BlueprintPdfDocumentProps {
  plan: SavedPlanData;
  userName?: string;
  userEmail?: string;
}

export const BlueprintPdfDocument: React.FC<BlueprintPdfDocumentProps> = ({
  plan,
  userName,
  userEmail,
}) => {
  const athleteIdentifier = userName || plan.displayName || userEmail || "Athlete";
  const createdFormatted = plan.createdAt
    ? new Date(plan.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Active Cycle";

  const shoppingList = generateConsolidatedShoppingList(plan.meals || []);

  const proteinCals = plan.protein * 4;
  const carbsCals = plan.carbs * 4;
  const fatCals = plan.fat * 9;
  const totalCalculatedCals = proteinCals + carbsCals + fatCals || plan.calories || 2000;
  const proteinPct = Math.round((proteinCals / totalCalculatedCals) * 100);
  const carbsPct = Math.round((carbsCals / totalCalculatedCals) * 100);
  const fatPct = Math.round((fatCals / totalCalculatedCals) * 100);

  const supplements = [
    {
      name: "Creatine Monohydrate",
      tier: "Tier 1 — Level A Consensus",
      dose: "3–5g daily (any time with fluid)",
      mechanism: "Replenishes cellular phosphocreatine for rapid ATP synthesis during maximal resistance efforts.",
      notes: "Saturation occurs in 3–4 weeks without loading. Non-hormonal and thoroughly researched.",
    },
    {
      name: "Whey or Plant Protein Isolate",
      tier: "Tier 1 — Level A Consensus",
      dose: "25–35g per serving (1 scoop post-workout or snack)",
      mechanism: "Provides rapid essential amino acids (specifically ~3g leucine) to trigger Muscle Protein Synthesis (MPS).",
      notes: "Adjunct to whole food meals. Pea/rice isolate blends match whey amino acid bioavailability.",
    },
    {
      name: "Vitamin D3 + K2",
      tier: "Tier 1 — Level A Consensus",
      dose: "2,000–4,000 IU daily (with morning fat)",
      mechanism: "Modulates gene transcription for endocrine hormone support, immune balance, and bone density.",
      notes: "Fat-soluble; ingest alongside dietary fats (e.g. whole eggs or avocado) for optimal bioavailability.",
    },
    {
      name: "Omega-3 Fatty Acids (EPA + DHA)",
      tier: "Tier 1 — Level A Consensus",
      dose: "1,000–2,000mg combined EPA/DHA daily",
      mechanism: "Enhances myocellular membrane fluidity and attenuates systemic delayed onset muscle soreness (DOMS).",
      notes: "Take with main meal. Vegans can substitute microalgae-derived EPA/DHA oil.",
    },
    {
      name: "Elemental Magnesium (Glycinate)",
      tier: "Tier 2 — High Evidence Adjunct",
      dose: "200–400mg 45–60 minutes pre-sleep",
      mechanism: "Essential cofactor for neuromuscular relaxation and parasympathetic CNS down-regulation.",
      notes: "Magnesium glycinate provides superior absorption with zero gastrointestinal distress.",
    },
  ];

  return (
    <Document title={`IronSync Fitness Blueprint - ${athleteIdentifier}`} author="IronSync Evidence Engine">
      {/* ============================================================== */}
      {/* PAGE 1: COVER DELIVERABLE                                       */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.coverPage}>
        {/* Top Header */}
        <View style={styles.coverHeader}>
          <View style={styles.coverBadge}>
            <Text style={styles.coverBadgeText}>OFFICIAL FITNESS SPECIFICATION &bull; v{plan.version}.0</Text>
          </View>
          <Text style={styles.coverTitle}>YOUR PERSONALIZED FITNESS BLUEPRINT</Text>
          <Text style={styles.coverSubtitle}>
            Calibrated hypertrophy progression, precision macronutrient architecture, and systemic central nervous system recovery protocol.
          </Text>

          {/* Meta Overview */}
          <View style={styles.coverMetaCard}>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>ATHLETE / CLIENT</Text>
              <Text style={styles.coverMetaValue}>{athleteIdentifier}</Text>
            </View>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>SYSTEM GOAL</Text>
              <Text style={styles.coverMetaValue}>
                {plan.goal.replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>DATE ISSUED</Text>
              <Text style={styles.coverMetaValue}>{createdFormatted}</Text>
            </View>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>ENGINE VERSION</Text>
              <Text style={styles.coverMetaValue}>IronSync v2.4 RLS</Text>
            </View>
          </View>
        </View>

        {/* Hero Metrics 6-Card Grid */}
        <View>
          <Text style={styles.subHeading}>PRIMARY TARGET ARCHITECTURE</Text>
          <View style={styles.heroGrid}>
            <View style={styles.heroCardHighlight}>
              <Text style={styles.heroLabel}>DAILY ENERGY INTAKE</Text>
              <Text style={styles.heroValueHighlight}>{plan.calories}</Text>
              <Text style={styles.heroSub}>kcal / day</Text>
            </View>
            <View style={styles.heroCardHighlight}>
              <Text style={styles.heroLabel}>PROTEIN TARGET</Text>
              <Text style={styles.heroValueHighlight}>{plan.protein}g</Text>
              <Text style={styles.heroSub}>{proteinPct}% of total calories</Text>
            </View>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>CARBOHYDRATES</Text>
              <Text style={styles.heroValue}>{plan.carbs}g</Text>
              <Text style={styles.heroSub}>{carbsPct}% glycogen fuel</Text>
            </View>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>DIETARY FATS</Text>
              <Text style={styles.heroValue}>{plan.fat}g</Text>
              <Text style={styles.heroSub}>{fatPct}% hormonal baseline</Text>
            </View>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>TRAINING CADENCE</Text>
              <Text style={styles.heroValue}>{plan.trainingDays} Days</Text>
              <Text style={styles.heroSub}>Per 7-day microcycle</Text>
            </View>
            <View style={styles.heroCard}>
              <Text style={styles.heroLabel}>NUTRITION ARCHETYPE</Text>
              <Text style={styles.heroValue}>
                {plan.dietType ? plan.dietType.toUpperCase() : "BALANCED"}
              </Text>
              <Text style={styles.heroSub}>Adherence prioritized</Text>
            </View>
          </View>
        </View>

        {/* Bottom Callout & Signature */}
        <View>
          <View style={styles.coverCallout}>
            <Text style={styles.coverCalloutText}>
              This document contains your verified individual training parameters. Adherence to prescribed set volume, rep tempos, and daily protein thresholds ensures predictable muscular adaptation without central nervous system burnout.
            </Text>
          </View>
          <View style={{ marginTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 7.5, color: "#9CA3AF" }}>
              IronSync Deterministic Calibration Engine &bull; Strictly for personal athletic guidance
            </Text>
            <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#059669" }}>
              CONFIDENTIAL BLUEPRINT
            </Text>
          </View>
        </View>
      </Page>

      {/* ============================================================== */}
      {/* PAGE 2: TARGETS, PROFILE & OVERLOAD METHODOLOGY                */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.page}>
        {/* Running Header */}
        <View style={styles.pageHeader} fixed>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>ATHLETE BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>{athleteIdentifier} &bull; v{plan.version}</Text>
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionNumber}>SECTION 01</Text>
            <Text style={styles.sectionTitle}>ANTHROPOMETRIC TARGETS & METHODOLOGY</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Calibrated Body Profile</Text>
        </View>

        {/* Profile Metrics Grid */}
        <View style={[styles.card, { marginBottom: 12 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Calibrated Anthropometric Parameters</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified Data</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <View style={{ width: "31%", marginBottom: 8 }}>
              <Text style={styles.heroLabel}>CURRENT WEIGHT</Text>
              <Text style={styles.heroValue}>{plan.weightKg ? `${plan.weightKg} kg` : "Baseline Logged"}</Text>
            </View>
            <View style={{ width: "31%", marginBottom: 8 }}>
              <Text style={styles.heroLabel}>TARGET WEIGHT</Text>
              <Text style={styles.heroValue}>{plan.targetWeightKg ? `${plan.targetWeightKg} kg` : "Goal Dependent"}</Text>
            </View>
            <View style={{ width: "31%", marginBottom: 8 }}>
              <Text style={styles.heroLabel}>HEIGHT</Text>
              <Text style={styles.heroValue}>{plan.heightCm ? `${plan.heightCm} cm` : "Standard Norm"}</Text>
            </View>
            <View style={{ width: "31%", marginBottom: 6 }}>
              <Text style={styles.heroLabel}>SESSION DURATION</Text>
              <Text style={styles.heroValue}>{plan.sessionDuration || 60} mins</Text>
            </View>
            <View style={{ width: "31%", marginBottom: 6 }}>
              <Text style={styles.heroLabel}>EQUIPMENT CONTEXT</Text>
              <Text style={styles.heroValue}>{plan.equipment ? plan.equipment.replace(/_/g, " ").toUpperCase() : "FULL GYM"}</Text>
            </View>
            <View style={{ width: "31%", marginBottom: 6 }}>
              <Text style={styles.heroLabel}>EXPERIENCE LEVEL</Text>
              <Text style={styles.heroValue}>{plan.experience ? plan.experience.toUpperCase() : "INTERMEDIATE"}</Text>
            </View>
          </View>
        </View>

        {/* Macronutrient Caloric Split Breakdown */}
        <View style={[styles.card, { marginBottom: 12 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Macronutrient Caloric Partitioning</Text>
            <Text style={{ fontSize: 7.5, color: "#6B7280" }}>Total: {plan.calories} kcal / day</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 8, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#059669" }}>PROTEIN (4 kcal/g)</Text>
              <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginVertical: 2 }}>{plan.protein}g</Text>
              <Text style={{ fontSize: 7, color: "#6B7280" }}>{proteinCals} kcal ({proteinPct}%)</Text>
              <Text style={{ fontSize: 6.5, color: "#9CA3AF", marginTop: 2 }}>Muscle Protein Synthesis</Text>
            </View>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 8, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#2563EB" }}>CARBOHYDRATES (4 kcal/g)</Text>
              <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginVertical: 2 }}>{plan.carbs}g</Text>
              <Text style={{ fontSize: 7, color: "#6B7280" }}>{carbsCals} kcal ({carbsPct}%)</Text>
              <Text style={{ fontSize: 6.5, color: "#9CA3AF", marginTop: 2 }}>Muscle Glycogen Resynthesis</Text>
            </View>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 8, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#D97706" }}>DIETARY FATS (9 kcal/g)</Text>
              <Text style={{ fontSize: 13, fontFamily: "Helvetica-Bold", color: "#111827", marginVertical: 2 }}>{plan.fat}g</Text>
              <Text style={{ fontSize: 7, color: "#6B7280" }}>{fatCals} kcal ({fatPct}%)</Text>
              <Text style={{ fontSize: 6.5, color: "#9CA3AF", marginTop: 2 }}>Endocrine & Cell Integrity</Text>
            </View>
          </View>
        </View>

        {/* Scientific Progression & Overload Directives */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Progressive Overload & Intensity Directives</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Double Progression Model</Text>
            </View>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>&bull;</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#111827" }}>The Double-Progression Framework: </Text>
              Do not add external weight until you achieve the maximum prescribed repetition count across all designated working sets with pristine form. Once unlocked, increase load by 2.0–2.5 kg (compound) or 1.0–1.25 kg (isolation) and reset to the bottom rep target.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>&bull;</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#111827" }}>Rate of Perceived Exertion (RPE): </Text>
              Compound barbell and dumbbell lifts should conclude at RPE 7.5–8.5 (1–2 Repetitions in Reserve). Machine and cable isolation movements can safely terminate at RPE 9–9.5 (0–1 RIR) to maximize metabolic stress without joint compromise.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>&bull;</Text>
            <Text style={styles.bulletText}>
              <Text style={{ fontFamily: "Helvetica-Bold", color: "#111827" }}>Eccentric Phase Cadence: </Text>
              Emphasize a controlled 2–3 second eccentric lowering phase on every repetition. Resist gravity deliberately; explosive concentric propulsion activates high-threshold motor units.
            </Text>
          </View>
        </View>

        {/* Running Footer */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>IronSync Official Fitness Blueprint &bull; Strictly for personal athletic use</Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* ============================================================== */}
      {/* PAGES 3+: WORKOUT PROTOCOL & WEEKLY SCHEDULE                   */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>ATHLETE BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>{athleteIdentifier} &bull; v{plan.version}</Text>
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionNumber}>SECTION 02</Text>
            <Text style={styles.sectionTitle}>PERIODIZED RESISTANCE PROTOCOL</Text>
          </View>
          <Text style={styles.sectionSubtitle}>{plan.splitName || `${plan.trainingDays}-Day Microcycle`}</Text>
        </View>

        {/* Microcycle Table Overview */}
        <View style={[styles.card, { marginBottom: 12 }]} wrap={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>7-Day Microcycle Schedule Matrix</Text>
            <Text style={{ fontSize: 7.5, color: "#6B7280" }}>{plan.trainingDays} Workouts / {7 - plan.trainingDays} Recovery Days</Text>
          </View>
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={[styles.th, { width: "20%" }]}>DAY</Text>
              <Text style={[styles.th, { width: "45%" }]}>FOCUS / TARGET GROUP</Text>
              <Text style={[styles.th, { width: "20%" }]}>CADENCE TAG</Text>
              <Text style={[styles.th, { width: "15%", textAlign: "right" }]}>TYPE</Text>
            </View>
            {plan.schedule.map((day, idx) => (
              <View key={idx} style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                <Text style={[styles.tdBold, { width: "20%", color: day.type === "workout" ? "#059669" : "#6B7280" }]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.td, { width: "45%", fontFamily: "Helvetica-Bold" }]}>
                  {day.focus}
                </Text>
                <Text style={[styles.td, { width: "20%", color: "#6B7280" }]}>
                  {day.tag}
                </Text>
                <Text style={[styles.tdBold, { width: "15%", textAlign: "right", color: day.type === "workout" ? "#059669" : "#D97706" }]}>
                  {day.type.toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Daily Workout Detailed Breakdowns */}
        {plan.schedule.map((day, dayIdx) => {
          if (day.type === "recovery") {
            return (
              <View key={dayIdx} style={styles.card} wrap={false}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{day.dayName}: {day.focus}</Text>
                  <View style={[styles.badge, { backgroundColor: "#FEF3C7", borderColor: "#FCD34D" }]}>
                    <Text style={[styles.badgeText, { color: "#92400E" }]}>Systemic Recovery Day</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 7.5, color: "#4B5563", lineHeight: 1.35 }}>
                  Active tissue supercompensation occurs today. Keep NEAT activity elevated with a 30-minute light conversational walk. Prioritize hydration ({plan.recoveryProtocol?.hydrationTarget || "3.0L"}), ensure whole-food protein targets are met, and execute 10 minutes of hip and thoracic mobility.
                </Text>
              </View>
            );
          }

          const exercises = day.exercises || [];

          return (
            <View key={dayIdx} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{day.dayName}: {day.focus}</Text>
                  <Text style={{ fontSize: 7, color: "#6B7280" }}>Prescribed Volume: {exercises.length} Targeted Exercises</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{day.tag}</Text>
                </View>
              </View>

              {exercises.length === 0 ? (
                <Text style={{ fontSize: 7.5, color: "#6B7280", fontStyle: "italic" }}>
                  Perform prescribed compound movements for {day.focus} maintaining 3–4 working sets per movement.
                </Text>
              ) : (
                <View style={styles.table}>
                  <View style={styles.tableRowHeader}>
                    <Text style={[styles.th, styles.colExercise]}>EXERCISE</Text>
                    <Text style={[styles.th, styles.colSetsReps]}>SETS & REPS</Text>
                    <Text style={[styles.th, styles.colRest]}>REST</Text>
                    <Text style={[styles.th, styles.colRpe]}>INTENSITY</Text>
                    <Text style={[styles.th, styles.colNotes]}>TARGET</Text>
                  </View>

                  {exercises.map((ex, exIdx) => {
                    const detail = getExerciseDetails(ex.name);
                    const cue = ex.executionCue || detail.executionCue;
                    const mistake = ex.commonMistake || detail.commonMistake;
                    const rest = ex.rest || detail.defaultRest;

                    return (
                      <View key={exIdx}>
                        <View style={exIdx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
                          <Text style={[styles.tdBold, styles.colExercise]}>{ex.name}</Text>
                          <Text style={[styles.td, styles.colSetsReps]}>{ex.setsReps}</Text>
                          <Text style={[styles.td, styles.colRest]}>{rest}</Text>
                          <Text style={[styles.td, styles.colRpe]}>{ex.rpe || "RPE 8"}</Text>
                          <Text style={[styles.td, styles.colNotes, { fontSize: 7, color: "#6B7280" }]}>
                            {detail.primaryMuscles[0] || "Primary"}
                          </Text>
                        </View>
                        {cue && (
                          <View style={styles.cueBox}>
                            <Text style={styles.cueText}>
                              <Text style={styles.cueBold}>Execution Cue: </Text>
                              {cue}
                            </Text>
                            {mistake && (
                              <Text style={[styles.cueText, { marginTop: 1.5, color: "#991B1B" }]}>
                                <Text style={{ fontFamily: "Helvetica-Bold", color: "#B91C1C" }}>Avoid Mistake: </Text>
                                {mistake}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>IronSync Official Fitness Blueprint &bull; Strictly for personal athletic use</Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* ============================================================== */}
      {/* PAGE: NUTRITION PROTOCOL                                       */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>ATHLETE BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>{athleteIdentifier} &bull; v{plan.version}</Text>
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionNumber}>SECTION 03</Text>
            <Text style={styles.sectionTitle}>PRECISION NUTRITION SCHEDULE</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Daily Meal Breakdown & Recipes</Text>
        </View>

        {/* Nutrition Overview Banner */}
        <View style={[styles.card, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", marginBottom: 12 }]} wrap={false}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={{ fontSize: 10, fontFamily: "Helvetica-Bold", color: "#065F46" }}>
                Target Daily Caloric Ingestion: {plan.calories} kcal
              </Text>
              <Text style={{ fontSize: 7.5, color: "#047857", marginTop: 2 }}>
                Protein: {plan.protein}g ({proteinPct}%) &bull; Carbs: {plan.carbs}g ({carbsPct}%) &bull; Fat: {plan.fat}g ({fatPct}%)
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{plan.dietType ? plan.dietType.toUpperCase() : "BALANCED"}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Meals */}
        {plan.meals.map((meal, mealIdx) => {
          const recipe = getMealRecipe(meal);

          return (
            <View key={mealIdx} style={styles.card} wrap={false}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>
                    Meal {mealIdx + 1}: {meal.name}
                  </Text>
                  <Text style={{ fontSize: 7, color: "#6B7280" }}>Scheduled Timing: {meal.timing}</Text>
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{meal.calories} kcal</Text>
                </View>
              </View>

              {/* Meal Macro Distribution */}
              <View style={styles.mealMacroRow}>
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemLabel}>PROTEIN</Text>
                  <Text style={[styles.macroItemVal, { color: "#059669" }]}>{meal.protein}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemLabel}>CARBS</Text>
                  <Text style={[styles.macroItemVal, { color: "#2563EB" }]}>{meal.carbs}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemLabel}>FATS</Text>
                  <Text style={[styles.macroItemVal, { color: "#D97706" }]}>{meal.fat}g</Text>
                </View>
                <View style={styles.macroItem}>
                  <Text style={styles.macroItemLabel}>SERVING</Text>
                  <Text style={[styles.macroItemVal, { color: "#374151", fontSize: 7.5 }]}>{recipe.servingSize}</Text>
                </View>
              </View>

              {/* Food Items & Portions */}
              <View style={{ marginBottom: 4 }}>
                <Text style={styles.subHeading}>Prescribed Ingredients & Portions:</Text>
                {meal.items.map((item, itmIdx) => (
                  <View key={itmIdx} style={styles.bulletItem}>
                    <Text style={styles.bulletDot}>&bull;</Text>
                    <Text style={styles.bulletText}>
                      <Text style={{ fontFamily: "Helvetica-Bold", color: "#1F2937" }}>{item.name}: </Text>
                      {item.portion}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Recipe Steps */}
              {recipe.preparation && recipe.preparation.length > 0 && (
                <View style={styles.recipeSection}>
                  <Text style={styles.subHeading}>Culinary Preparation Steps:</Text>
                  {recipe.preparation.map((step, stpIdx) => (
                    <View key={stpIdx} style={styles.bulletItem}>
                      <Text style={[styles.bulletDot, { fontSize: 7, color: "#6B7280" }]}>{stpIdx + 1}.</Text>
                      <Text style={styles.bulletText}>{step}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>IronSync Official Fitness Blueprint &bull; Strictly for personal athletic use</Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* ============================================================== */}
      {/* PAGE: SUPPLEMENT PROTOCOL & RECOVERY ARCHITECTURE              */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>ATHLETE BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>{athleteIdentifier} &bull; v{plan.version}</Text>
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionNumber}>SECTION 04</Text>
            <Text style={styles.sectionTitle}>EVIDENCE-BASED SUPPLEMENTS & RECOVERY</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Validated Clinical Compounds</Text>
        </View>

        {/* Mandatory Educational Disclaimer */}
        <View style={styles.disclaimerBox} wrap={false}>
          <Text style={styles.disclaimerTitle}>General Educational Guidance Only &bull; Non-Medical Specification</Text>
          <Text style={styles.disclaimerText}>
            IronSync is not a healthcare provider and does not sell dietary supplements. The nutritional compounds below reflect sports science consensus for healthy active adults. Always consult with a licensed physician before introducing any supplement, especially if you have diagnosed conditions or take prescribed medications.
          </Text>
        </View>

        {/* Supplement Cards */}
        {supplements.map((supp, suppIdx) => (
          <View key={suppIdx} style={styles.card} wrap={false}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{supp.name}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{supp.tier}</Text>
              </View>
            </View>
            <View style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#059669" }}>
                Target Dosage: <Text style={{ color: "#111827" }}>{supp.dose}</Text>
              </Text>
            </View>
            <Text style={{ fontSize: 7.5, color: "#374151", marginBottom: 3, lineHeight: 1.3 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>Physiological Mechanism: </Text>
              {supp.mechanism}
            </Text>
            <Text style={{ fontSize: 7, color: "#6B7280", fontStyle: "italic", lineHeight: 1.3 }}>
              Practical Note: {supp.notes}
            </Text>
          </View>
        ))}

        {/* Recovery Protocols */}
        <View style={[styles.card, { marginTop: 4 }]} wrap={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Systemic Recovery & Sleep Architecture</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Circadian Restoration</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 6, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={styles.heroLabel}>SLEEP TARGET</Text>
              <Text style={[styles.heroValue, { fontSize: 11 }]}>{plan.recoveryProtocol?.sleepTarget || "7–9 hours"}</Text>
              <Text style={{ fontSize: 6.5, color: "#6B7280", marginTop: 2 }}>Non-REM slow wave + REM cycles</Text>
            </View>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 6, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={styles.heroLabel}>HYDRATION BASELINE</Text>
              <Text style={[styles.heroValue, { fontSize: 11 }]}>{plan.recoveryProtocol?.hydrationTarget || "3.0 L"}</Text>
              <Text style={{ fontSize: 6.5, color: "#6B7280", marginTop: 2 }}>+500ml per training session</Text>
            </View>
            <View style={{ width: "31%", backgroundColor: "#FFFFFF", padding: 6, borderRadius: 4, borderWidth: 0.5, borderColor: "#E5E7EB" }}>
              <Text style={styles.heroLabel}>REST DAYS</Text>
              <Text style={[styles.heroValue, { fontSize: 11 }]}>{7 - plan.trainingDays} Days / Week</Text>
              <Text style={{ fontSize: 6.5, color: "#6B7280", marginTop: 2 }}>Dedicated tissue repair</Text>
            </View>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>&bull;</Text>
            <Text style={styles.bulletText}>
              Maintain consistent circadian sleep and wake timestamps within a 30-minute window, even on non-training days.
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bulletDot}>&bull;</Text>
            <Text style={styles.bulletText}>
              Keep sleep environment below 19°C (66°F) and eliminate blue light exposure 60 minutes prior to scheduled sleep onset.
            </Text>
          </View>
        </View>

        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>IronSync Official Fitness Blueprint &bull; Strictly for personal athletic use</Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* ============================================================== */}
      {/* PAGE: CONSOLIDATED SHOPPING LIST                               */}
      {/* ============================================================== */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader} fixed>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>ATHLETE BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>{athleteIdentifier} &bull; v{plan.version}</Text>
        </View>

        <View style={styles.sectionTitleRow}>
          <View>
            <Text style={styles.sectionNumber}>SECTION 05</Text>
            <Text style={styles.sectionTitle}>MASTER GROCERY & PANTRY CHECKLIST</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Directly Extracted from Daily Meals</Text>
        </View>

        <View style={[styles.card, { marginBottom: 10 }]} wrap={false}>
          <Text style={{ fontSize: 7.5, color: "#4B5563", lineHeight: 1.35 }}>
            This checklist consolidates every raw ingredient and whole food item required across your active daily meal protocol. Quantities reflect baseline daily provisions. Multiply quantities by 7 for complete weekly bulk grocery shopping.
          </Text>
        </View>

        {/* Two-Column Shopping Grid */}
        <View style={styles.shoppingGrid}>
          {/* Protein Sources */}
          {shoppingList.proteinSources.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>High-Quality Protein Sources</Text>
              {shoppingList.proteinSources.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Carbs & Grains */}
          {shoppingList.carbsAndGrains.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>Complex Carbohydrates & Grains</Text>
              {shoppingList.carbsAndGrains.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Fresh Produce */}
          {shoppingList.freshProduce.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>Fresh Produce (Vegetables & Fruits)</Text>
              {shoppingList.freshProduce.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Dairy & Alternatives */}
          {shoppingList.dairyAndAlternatives.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>Dairy & Plant Alternatives</Text>
              {shoppingList.dairyAndAlternatives.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Pantry & Healthy Fats */}
          {shoppingList.pantryAndFats.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>Pantry, Healthy Fats & Nuts</Text>
              {shoppingList.pantryAndFats.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Seasonings & Other */}
          {shoppingList.seasoningsAndOther.length > 0 && (
            <View style={styles.shoppingCol} wrap={false}>
              <Text style={styles.shoppingColHeader}>Seasonings & Other Essentials</Text>
              {shoppingList.seasoningsAndOther.map((item, idx) => (
                <View key={idx} style={styles.shoppingItemRow}>
                  <View style={styles.checkbox} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.shoppingItemName}>
                      {item.name}
                      <Text style={styles.shoppingItemPortion}> ({item.portion})</Text>
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Final Sign-off Note */}
        <View style={[styles.card, { marginTop: 10, backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]} wrap={false}>
          <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: "#065F46", marginBottom: 2 }}>
            IronSync Commitment to Athletic Execution
          </Text>
          <Text style={{ fontSize: 7, color: "#047857", lineHeight: 1.35 }}>
            Consistently executing this training and nutritional protocol over an 8 to 12-week mesocycle creates the systemic physiological conditions required for transformative adaptation. Track each repetition, maintain protein fidelity, and record personal records weekly.
          </Text>
        </View>

        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>IronSync Official Fitness Blueprint &bull; Strictly for personal athletic use</Text>
          <Text
            style={styles.footerPageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
