// ==========================================
// SECTION 1: EXPLORER / LEARNER TOOL
// ==========================================

const baseSelect = document.getElementById("baseColor");
const patternSelect = document.getElementById("pattern");
const spotsSelect = document.getElementById("spots");
const image = document.getElementById("sheepImage");
const description = document.getElementById("description");
const buttonsDiv = document.getElementById("sheepButtons");

// Descriptions
const baseDescriptions = {
  Black: "Shetlands come in two base colors, black and brown. Black base color is dominant and a sheep only needs one copy of the black gene for it to show. Black base color produces black pigment in both wool and skin.",
  Brown: "Shetlands come in two base colors, black and brown. Brown base color is ressesive and a sheep needs two copies of the brown gene for it to show. Breeding to a brown sheep can show if the other parent carries brown."
};

const patternDescriptions = {
  solid: "Patterns overlay the base color. Solid pattern shows the base color evenly throughout the body and is ressesive to all other patterns.",
  white: "Patterns overlay the base color. White pattern covers the base color, leaving only small traces of the base color visible if any. The white pattern is dominant to all other patterns.",
  Katmoget: "Patterns overlay the base color. Katmoget pattern gives a light body with darker belly and face mask. It is dominant only to the solid pattern but is very common. It is sometime co-dominante with Gulmoget or Fading creatin a mixed pattern.",
  Gulmoget: "Patterns overlay the base color. Gulmoget pattern is the reverse of Katmoget — dark body with lighter belly and eye stripes. It is dominant to all other patterns except white.",
  Fading: "Patterns overlay the base color. Fading pattern lightens with age, often starting darker at birth and becoming paler in the body. It is dominant to Karmoget and Solid but recessive to Gulmoget and White."
};

const spotDescriptions = {
  yes: "Spotting is reccessive and a sheep needs two copies of the gene to show spots. Spotted sheep have random white or colored patches overlaying base and pattern. Even if your sheep is almost completely white, it is technically black or brown with a large white spot. Shetland come in numerous different spotting patterns, most have names in the shetland dialect, describing the specific spotting pattern. Alough you may be able to breed for spots there is no way to breed for a specifc spotting pattern.",
  no: "Spotting is recessive, so even if a sheep does not show spots, it may carry the spotting gene."
};

// Map pattern key to actual file casing
const patternToFileCase = {
  "solid": "Solid",
  "white": "White",
  "Katmoget": "Katmoget",
  "Gulmoget": "Gulmoget",
  "Fading": "Fading",
  "Solid": "Solid",
  "White": "White"
};

let currentBase = "";
let currentPattern = "";
let currentSpot = "";

// Helper to assemble accurate image file path
function buildImagePath(base, pattern, spot) {
  if (!base) return "images/Blank_.png";
  
  let formattedPattern = pattern ? patternToFileCase[pattern] : "";
  let spotSuffix = spot === "yes" || spot === "ss" ? "_spot" : "";

  if (!formattedPattern && !spotSuffix) {
    return `images/${base}_.png`;
  }
  if (!formattedPattern && spotSuffix) {
    return `images/${base}_Solid${spotSuffix}.png`;
  }

  return `images/${base}_${formattedPattern}${spotSuffix}.png`;
}

// Update Explorer Image
function updateImage() {
  image.src = buildImagePath(currentBase, currentPattern, currentSpot);
}

// Update description
function updateDescription() {
  let desc = "";

  if (currentBase && baseDescriptions[currentBase]) {
    desc += `<span class="desc-part">${baseDescriptions[currentBase]}</span>`;
  }

  if (currentPattern && patternDescriptions[currentPattern]) {
    desc += `<span class="desc-part">${patternDescriptions[currentPattern]}</span>`;
  }

  if (currentSpot && spotDescriptions[currentSpot]) {
    desc += `<span class="desc-part">${spotDescriptions[currentSpot]}</span>`;
  }

  if (!desc) {
    desc = "Select a base color to start learning about Shetland sheep genetics.";
  }

  description.innerHTML = desc;

  if (currentBase && currentPattern && currentSpot) {
    buttonsDiv.style.display = "block";
  } else {
    buttonsDiv.style.display = "none";
  }
}

// Event listeners for Explorer Controls
baseSelect.addEventListener("change", () => {
  currentBase = baseSelect.value;
  currentPattern = "";
  currentSpot = "";

  patternSelect.disabled = false;
  patternSelect.value = "";
  spotsSelect.disabled = true;
  spotsSelect.value = "";

  updateImage();
  updateDescription();
});

patternSelect.addEventListener("change", () => {
  currentPattern = patternSelect.value;
  currentSpot = "";

  spotsSelect.disabled = false;
  spotsSelect.value = "";

  updateImage();
  updateDescription();
});

spotsSelect.addEventListener("change", () => {
  currentSpot = spotsSelect.value;

  updateImage();
  updateDescription();
});

document.getElementById("buttonThis").addEventListener("click", () => {
  description.innerHTML = `
    <span class="desc-part">
    Great! This sheep matches the selection you made.
    </span>
    <span class="desc-part">
    Keep in mind, this is just the very basics of Shetland sheep color genetics. There are other factors like <strong>extension</strong>, <strong>intensity</strong>, and <strong>modifiers</strong> that can change the shade and pattern of the fleece in ways we haven’t fully covered here.
    </span>
    <span class="desc-part">
    Use this as a starting point to explore more complex genetics and see how real-life sheep can vary even with the same base color and pattern.
    </span>
  `;
});

document.getElementById("buttonDifferent").addEventListener("click", () => {
  description.innerHTML = `
    <span class="desc-part">
    Hmm, your sheep looks different from the options selected.
    </span>
    <span class="desc-part">
    Remember, what we’re showing here is just the basics of Shetland sheep color genetics. Real sheep can vary due to <strong>extension</strong>, <strong>intensity</strong>, and other <strong>modifiers</strong> that change how colors and patterns appear.
    </span>
    <span class="desc-part">
    This is a great opportunity to explore and compare your sheep to see how these additional genes influence the fleece.
    </span>
  `;
});


// ==========================================
// SECTION 2: BREEDING CALCULATOR
// ==========================================

const patternRank = {
  "Awt": 5, // White
  "Agt": 4, // Gulmoget
  "Ag":  3, // Greying
  "Ab":  2, // Katmoget
  "Aa":  1  // Solid
};

const patternToFilename = {
  "Awt": "White",
  "Agt": "Gulmoget",
  "Ag":  "Fading",
  "Ab":  "Katmoget",
  "Aa":  "Solid"
};

const patternDisplayName = {
  "Awt": "White",
  "Agt": "Gulmoget",
  "Ag":  "Greying",
  "Ab":  "Katmoget",
  "Aa":  "Solid"
};

// Parent Elements
const ramBase = document.getElementById("ramBase");
const ramPattern1 = document.getElementById("ramPattern1");
const ramPattern2 = document.getElementById("ramPattern2");
const ramSpot = document.getElementById("ramSpot");
const ramImage = document.getElementById("ramImage");

const eweBase = document.getElementById("eweBase");
const ewePattern1 = document.getElementById("ewePattern1");
const ewePattern2 = document.getElementById("ewePattern2");
const eweSpot = document.getElementById("eweSpot");
const eweImage = document.getElementById("eweImage");

const calculateBtn = document.getElementById("calculateBreed");
const resultsContainer = document.getElementById("breedingResults");
const resultsList = document.getElementById("resultsList");

function getExpressedPattern(p1, p2) {
  const r1 = patternRank[p1];
  const r2 = patternRank[p2];

  return r1 >= r2 ? p1 : p2;
}

// Update Image Previews for Parents
function updateParentPreview(baseElem, p1Elem, p2Elem, spotElem, targetImg) {
  const bVal = baseElem.value;
  const baseColor = bVal.includes("bb") ? "Brown" : "Black";
  
  const expressedAllele = getExpressedPattern(p1Elem.value, p2Elem.value);
  const patternFile = patternToFilename[expressedAllele];
  const isSpotted = spotElem.value === "ss" ? "yes" : "no";

  targetImg.src = buildImagePath(baseColor, patternFile, isSpotted);
}

// Bind event listeners for calculator parent inputs
[ramBase, ramPattern1, ramPattern2, ramSpot].forEach(elem => {
  elem.addEventListener("change", () => updateParentPreview(ramBase, ramPattern1, ramPattern2, ramSpot, ramImage));
});

[eweBase, ewePattern1, ewePattern2, eweSpot].forEach(elem => {
  elem.addEventListener("change", () => updateParentPreview(eweBase, ewePattern1, ewePattern2, eweSpot, eweImage));
});

// Initial Parent Previews Initialization
updateParentPreview(ramBase, ramPattern1, ramPattern2, ramSpot, ramImage);
updateParentPreview(eweBase, ewePattern1, ewePattern2, eweSpot, eweImage);

function getCombos(a1, a2, b1, b2) {
  return [
    [a1, b1],
    [a1, b2],
    [a2, b1],
    [a2, b2]
  ];
}

// Calculate outcomes
calculateBtn.addEventListener("click", () => {
  const ramB = ramBase.value.split("");
  const eweB = eweBase.value.split("");
  const baseCombos = getCombos(ramB[0], ramB[1], eweB[0], eweB[1]);

  const patternCombos = getCombos(ramPattern1.value, ramPattern2.value, ewePattern1.value, ewePattern2.value);

  const ramS = ramSpot.value.split("");
  const eweS = eweSpot.value.split("");
  const spotCombos = getCombos(ramS[0], ramS[1], eweS[0], eweS[1]);

  const outcomes = {};
  const totalCombos = 64;

  baseCombos.forEach(b => {
    const isBrown = (b[0] === 'b' && b[1] === 'b');
    const baseName = isBrown ? "Brown" : "Black";

    patternCombos.forEach(p => {
      const expressedAllele = getExpressedPattern(p[0], p[1]);
      const patternFile = patternToFilename[expressedAllele];
      const displayPattern = patternDisplayName[expressedAllele];

      spotCombos.forEach(s => {
        const isSpotted = (s[0] === 's' && s[1] === 's');
        const spotState = isSpotted ? "yes" : "no";

        const label = `${baseName} ${displayPattern}${isSpotted ? " (Spotted)" : ""}`;
        const imageSrc = buildImagePath(baseName, patternFile, spotState);

        if (!outcomes[label]) {
          outcomes[label] = { count: 0, imageSrc: imageSrc };
        }
        outcomes[label].count++;
      });
    });
  });

  // Render outcomes
  resultsList.innerHTML = "";
  Object.keys(outcomes).forEach(key => {
    const percentage = Math.round((outcomes[key].count / totalCombos) * 100);
    
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${outcomes[key].imageSrc}" alt="${key}">
      <h4>${key}</h4>
      <p><strong>${percentage}% Probability</strong></p>
    `;
    resultsList.appendChild(card);
  });

  resultsContainer.style.display = "block";
});
