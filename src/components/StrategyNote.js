// Mobile vs Desktop comparison note
export function renderStrategyNote(strategy) {
  return `
    <div class="bg-orange-50 rounded-lg p-4 mb-6 border border-orange-100">
      <p class="text-xs text-gray-700">
        <strong>Testing Strategy:</strong> ${
          strategy === "mobile" ? "📱 Mobile" : "💻 Desktop"
        } • 
        This report shows performance metrics from a ${
          strategy === "mobile"
            ? "simulated mobile device (Moto G4)"
            : "desktop environment"
        }.
        ${
          strategy === "mobile"
            ? "Mobile users experience different network conditions and device capabilities."
            : "Desktop users typically have faster connections and more powerful hardware."
        }
      </p>
    </div>
  `;
}
