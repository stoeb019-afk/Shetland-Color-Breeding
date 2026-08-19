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
  Brown: "Shetlands come in two base colors, black and brown. Brown base color is recessive and a sheep needs two copies of the brown gene for it to show. Breeding to a brown sheep can show if the other parent carries brown."
};

const patternDescriptions = {
  solid: "Patterns overlay the base color. Solid pattern shows the base color evenly throughout the body and is recessive to all other patterns.",
  white: "Patterns overlay the base color. White pattern covers the base color, leaving only small traces of the base color visible if any. The white pattern is dominant to all other patterns.",
  Katmoget: "Patterns overlay the base color. Katmoget pattern gives a light body with darker belly and face mask. It is dominant only to the solid pattern but is very common.",
  Gulmoget: "Patterns overlay the base color. Gulmoget pattern is the reverse of Katmoget — dark body with lighter belly and eye stripes. It is dominant to all other patterns except white.",
  Fading: "Patterns overlay the base color. Fading pattern lightens with age, often starting darker at birth and becoming paler in the body."
};

const spotDescriptions = {
  yes: "Spotting is recessive and a sheep needs two copies of the gene to show spots. Spotted sheep have random white or colored patches overlaying base and pattern.",
  no: "Spotting is recessive, so even if a sheep does not show spots, it may carry the spotting gene."
};

let currentBase = "";
let currentPattern = "";
let currentSpot = "";

// Normalizes any pattern string (dropdown value or genetic allele) to match GitHub file casing
function formatPatternName(pattern) {
  if (!pattern) return "";
  const p = pattern.toLowerCase();
  if (p === "solid" || p === "aa") return "Solid";
  if (p === "white" || p === "awt") return "White";
  if (p === "katmoget" || p === "ab") return "Katmoget";
  if (p === "gulmoget" || p === "agt") return "Gulmoget";
  if (p === "fading" || p === "greying" || p === "ag") return "Fading";
  return pattern;
}

// Builds the exact relative image URL matching your repository files
function buildImagePath(base, pattern, spot) {
  if (!base) return "images/Blank_.png";

  const formattedBase = (base.toLowerCase().includes("brown") || base === "bb") ? "Brown" : "Black";
  const formattedPattern = formatPatternName(pattern);
  const isSpotted = (spot === "yes" || spot === "ss" || spot === "_Spot" || spot === "Spot");
  const spotSuffix = isSpotted ? "_Spot" : "";

  // When only Base color is selected (e.g., Black_.png or Brown_.png)
  if (!formattedPattern) {
    return `images/${formattedBase}_.png`;
  }

  // Exact file path construction (e.g., images/Black_Solid_Spot.png)
  return `images/${formattedBase}_${formattedPattern}${spotSuffix}.png`;
}

function updateImage() {
  image.src = buildImagePath(currentBase, currentPattern, currentSpot);
}

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
  buttonsDiv.style.display = (currentBase && currentPattern && currentSpot) ? "block" : "none";
}

// Explorer Control Event Listeners
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
    <span class="desc-part">Great! This sheep matches the selection you made.</span>
    <span class="desc-part">Keep in mind, this covers the basics. Modifiers, extension, and intensity genes can alter fleece shade in real life.</span>
  `;
});

document.getElementById("buttonDifferent").addEventListener("click", () => {
  description.innerHTML = `
    <span class="desc-part">Hmm, your sheep looks different from the options selected.</span>
    <span class="desc-part">Real sheep can vary due to modifiers, extension, and intensity genes altering fleece appearance.</span>
  `;
});


// ==========================================
// SECTION 2: BREEDING CALCULATOR
// ==========================================

const patternRank = {
  "Awt": 5, // White
  "Agt": 4, // Gulmoget
  "Ag":  3, // Fading
  "Ab":  2, // Katmoget
  "Aa":  1  // Solid
};

const patternDisplayName = {
  "Awt": "White",
  "Agt": "Gulmoget",
  "Ag":  "Fading",
  "Ab":  "Katmoget",
  "Aa":  "Solid"
};

// Parent Select Elements
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
  return patternRank[p1] >= patternRank[p2] ? p1 : p2;
}

function updateParentPreview(baseElem, p1Elem, p2Elem, spotElem, targetImg) {
  const expressedAllele = getExpressedPattern(p1Elem.value, p2Elem.value);
  targetImg.src = buildImagePath(baseElem.value, expressedAllele, spotElem.value);
}

// Bind Parent Change Listeners
[ramBase, ramPattern1, ramPattern2, ramSpot].forEach(elem => {
  elem.addEventListener("change", () => updateParentPreview(ramBase, ramPattern1, ramPattern2, ramSpot, ramImage));
});

[eweBase, ewePattern1, ewePattern2, eweSpot].forEach(elem => {
  elem.addEventListener("change", () => updateParentPreview(eweBase, ewePattern1, ewePattern2, eweSpot, eweImage));
});

// Initial Parent Previews
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

// Calculator Logic
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
      const displayPattern = patternDisplayName[expressedAllele];

      spotCombos.forEach(s => {
        const isSpotted = (s[0] === 's' && s[1] === 's');
        const spotState = isSpotted ? "yes" : "no";

        const label = `${baseName} ${displayPattern}${isSpotted ? " (Spotted)" : ""}`;
        const imageSrc = buildImagePath(baseName, expressedAllele, spotState);

        if (!outcomes[label]) {
          outcomes[label] = { count: 0, imageSrc: imageSrc };
        }
        outcomes[label].count++;
      });
    });
  });

  // Render Results
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
