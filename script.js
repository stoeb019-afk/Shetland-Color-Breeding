// Map pattern key to exact file casing
const patternToFileCase = {
  "solid": "Solid",
  "white": "White",
  "Katmoget": "Katmoget",
  "Gulmoget": "Gulmoget",
  "Fading": "Fading",
  "Solid": "Solid",
  "White": "White"
};

// Helper to assemble accurate image file path matching exact file casing
function buildImagePath(base, pattern, spot) {
  if (!base) return "images/Blank_.png";
  
  let formattedPattern = pattern ? patternToFileCase[pattern] : "";
  let spotSuffix = (spot === "yes" || spot === "ss") ? "_Spot" : "";

  // Base color selected, no pattern yet
  if (!formattedPattern) {
    if (spotSuffix) {
      return `images/${base}_Solid${spotSuffix}.png`;
    }
    return `images/${base}_.png`;
  }

  // Base color and pattern selected
  return `images/${base}_${formattedPattern}${spotSuffix}.png`;
}
