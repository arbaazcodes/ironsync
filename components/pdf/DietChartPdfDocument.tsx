import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { DayMeal } from "@/lib/engine/mealGenerator";

interface DietChartPdfDocumentProps {
  member: {
    fullName: string;
    memberId: string;
    fitnessGoal?: string;
    dietType?: string;
  };
  assignedPlan: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    dietStrategyNotes?: string;
    meals?: DayMeal[];
  };
  generatedDate?: string;
}

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
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#10B981",
    paddingBottom: 8,
    marginBottom: 16,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#059669",
    letterSpacing: 1.5,
  },
  headerTagline: {
    fontSize: 8,
    color: "#6B7280",
    marginLeft: 8,
  },
  headerMeta: {
    fontSize: 8,
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
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: "#9CA3AF",
  },

  // Member Identity Card
  profileCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileCol: {
    flexDirection: "column",
    flex: 1,
  },
  profileLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  profileVal: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },

  // Macro Target Strip
  macroContainer: {
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 12,
    marginBottom: 18,
  },
  macroTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#065F46",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  macroGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroItem: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  macroItemLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  macroItemValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    marginTop: 2,
  },

  // Section Titles
  sectionHeading: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  // Meal Cards
  mealCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginBottom: 10,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
    paddingBottom: 4,
  },
  mealName: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  mealMacros: {
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#059669",
  },
  itemsTable: {
    marginTop: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F9FAFB",
  },
  itemName: {
    fontSize: 8,
    color: "#374151",
    flex: 2,
  },
  itemPortion: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#4B5563",
    flex: 1,
    textAlign: "right",
  },
  itemMacros: {
    fontSize: 7.5,
    color: "#6B7280",
    flex: 1.5,
    textAlign: "right",
  },
  culinaryTip: {
    fontSize: 7.5,
    fontStyle: "italic",
    color: "#6B7280",
    marginTop: 5,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: "#F3F4F6",
  },

  // Strategy Callout Box
  strategyBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginTop: 10,
  },
  strategyTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  strategyText: {
    fontSize: 8,
    color: "#4B5563",
    lineHeight: 1.4,
  },

  // Kitchen Measurement Guide
  guideContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 10,
    marginTop: 10,
  },
  guideTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  guideGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  guideItem: {
    width: "31%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    padding: 5,
    marginBottom: 5,
  },
  guideItemName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  guideItemMeasure: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginTop: 1,
  },
  guideItemDesc: {
    fontSize: 6.5,
    color: "#6B7280",
    marginTop: 1,
  },

  // 4 Golden Rules
  rulesContainer: {
    backgroundColor: "#ECFDF5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    padding: 10,
    marginTop: 10,
  },
  rulesTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#065F46",
    textTransform: "uppercase",
    marginBottom: 5,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3.5,
  },
  ruleBullet: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    width: 14,
  },
  ruleText: {
    fontSize: 7,
    color: "#1F2937",
    flex: 1,
    lineHeight: 1.3,
  },
});

export const DietChartPdfDocument: React.FC<DietChartPdfDocumentProps> = ({
  member,
  assignedPlan,
  generatedDate,
}) => {
  const dateStr =
    generatedDate ||
    new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

  const meals = assignedPlan.meals || [];

  return (
    <Document
      title={`IronSync-Diet-Chart-${member.memberId}`}
      author="IronSync Free Community Gym"
      subject="Personalized Nutritional Blueprint"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <View style={styles.headerBrand}>
            <Text style={styles.headerLogo}>IRONSYNC</Text>
            <Text style={styles.headerTagline}>&bull; ATHLETIC NUTRITION BLUEPRINT</Text>
          </View>
          <Text style={styles.headerMeta}>Free Community Gym Portal</Text>
        </View>

        {/* Member Profile Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileCol}>
              <Text style={styles.profileLabel}>Athlete Name</Text>
              <Text style={styles.profileVal}>{member.fullName}</Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={styles.profileLabel}>Member ID</Text>
              <Text style={styles.profileVal}>{member.memberId}</Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={styles.profileLabel}>Target Goal</Text>
              <Text style={styles.profileVal}>{member.fitnessGoal || "General Fitness"}</Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={styles.profileLabel}>Diet Type</Text>
              <Text style={styles.profileVal}>
                {(member.dietType || "Standard").replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileCol}>
              <Text style={styles.profileLabel}>Issued Date</Text>
              <Text style={styles.profileVal}>{dateStr}</Text>
            </View>
          </View>
        </View>

        {/* Daily Caloric & Macronutrient Targets Strip */}
        <View style={styles.macroContainer}>
          <Text style={styles.macroTitle}>Prescribed Daily Macronutrient Distribution</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Text style={styles.macroItemLabel}>Daily Energy</Text>
              <Text style={styles.macroItemValue}>{assignedPlan.calories || 2600} kcal</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroItemLabel}>Protein</Text>
              <Text style={styles.macroItemValue}>{assignedPlan.protein || 180}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroItemLabel}>Carbohydrates</Text>
              <Text style={styles.macroItemValue}>{assignedPlan.carbs || 300}g</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroItemLabel}>Healthy Fats</Text>
              <Text style={styles.macroItemValue}>{assignedPlan.fat || 70}g</Text>
            </View>
          </View>
        </View>

        {/* Prescribed Daily Meals Breakdown */}
        <Text style={styles.sectionHeading}>Prescribed Meal-by-Meal Schedule</Text>

        {meals.length === 0 ? (
          <View style={styles.mealCard}>
            <Text style={styles.mealName}>Default Balanced Nutrition Structure</Text>
            <Text style={{ fontSize: 8, color: "#6B7280", marginTop: 4 }}>
              Follow your prescribed daily calorie ({assignedPlan.calories || 2600} kcal) and protein (
              {assignedPlan.protein || 180}g) targets across 3–4 balanced meals daily.
            </Text>
          </View>
        ) : (
          meals.map((meal, idx) => (
            <View key={idx} style={styles.mealCard} wrap={false}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>
                  {meal.timing ? `${meal.timing.toUpperCase()} &bull; ` : ""}
                  {meal.name}
                </Text>
                <Text style={styles.mealMacros}>
                  {meal.calories} kcal | {meal.protein}g Protein | {meal.carbs}g Carbs | {meal.fat}g Fat
                </Text>
              </View>

              {/* Items Breakdown Table */}
              {meal.items && meal.items.length > 0 && (
                <View style={styles.itemsTable}>
                  {meal.items.map((item, itemIdx) => (
                    <View key={itemIdx} style={styles.itemRow}>
                      <Text style={styles.itemName}>• {item.name}</Text>
                      <Text style={styles.itemPortion}>{item.portion}</Text>
                    </View>
                  ))}
                </View>
              )}

              {meal.notes && (
                <Text style={styles.culinaryTip}>Note: {meal.notes}</Text>
              )}
            </View>
          ))
        )}

        {/* Kitchen Measurement Guide */}
        <View style={styles.guideContainer} wrap={false}>
          <Text style={styles.guideTitle}>Kitchen Measurement Guide (No Scale Needed)</Text>
          <View style={styles.guideGrid}>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Katori (Bowl)</Text>
              <Text style={styles.guideItemMeasure}>~150g cooked</Text>
              <Text style={styles.guideItemDesc}>Rice, dal, curd, chickpeas</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Palm Size</Text>
              <Text style={styles.guideItemMeasure}>~150-180g</Text>
              <Text style={styles.guideItemDesc}>Paneer, chicken breast, fish</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Fist Size</Text>
              <Text style={styles.guideItemMeasure}>1 Serving</Text>
              <Text style={styles.guideItemDesc}>1 Apple/banana or 2 rotis</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Spoon (Tbsp)</Text>
              <Text style={styles.guideItemMeasure}>~15g / 5ml</Text>
              <Text style={styles.guideItemDesc}>Peanut butter, olive oil/ghee</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Glass</Text>
              <Text style={styles.guideItemMeasure}>250 ml</Text>
              <Text style={styles.guideItemDesc}>Water, toned milk, chaas</Text>
            </View>
            <View style={styles.guideItem}>
              <Text style={styles.guideItemName}>1 Scoop</Text>
              <Text style={styles.guideItemMeasure}>~30-32g</Text>
              <Text style={styles.guideItemDesc}>Whey protein powder</Text>
            </View>
          </View>
        </View>

        {/* 4 Golden Rules of Gym Nutrition */}
        <View style={styles.rulesContainer} wrap={false}>
          <Text style={styles.rulesTitle}>4 Golden Rules of Gym Nutrition</Text>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleBullet}>1.</Text>
            <Text style={styles.ruleText}>
              Hydration: Drink 3.5L to 4.0L of water daily. Avoid heavy water intake immediately with meals.
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleBullet}>2.</Text>
            <Text style={styles.ruleText}>
              Nutrient Timing: Consume light carbs 45m before workout; take protein within 30m post-workout.
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleBullet}>3.</Text>
            <Text style={styles.ruleText}>
              Oil & Salt Control: Limit added cooking oils to 1-2 tbsp/day. Use moderate rock salt to prevent water retention.
            </Text>
          </View>
          <View style={styles.ruleRow}>
            <Text style={styles.ruleBullet}>4.</Text>
            <Text style={styles.ruleText}>
              Strictly Avoid: Refined sugar, sugary sodas, deep-fried street foods, and alcohol.
            </Text>
          </View>
        </View>

        {/* Strategy Notes */}
        {assignedPlan.dietStrategyNotes && (
          <View style={styles.strategyBox} wrap={false}>
            <Text style={styles.strategyTitle}>Coach Nutritional Directives</Text>
            <Text style={styles.strategyText}>{assignedPlan.dietStrategyNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.pageFooter} fixed>
          <Text style={styles.footerText}>
            IronSync Gym Management System &bull; 100% Free Community Gym &bull; https://www.ironsync.online
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `A4 Print Layout • Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
};
