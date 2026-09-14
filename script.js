// ==========================================
// SECTION 1: COLOR GENETICS EXPLORER
// ==========================================

const baseSelect = document.getElementById("baseColor");
const patternSelect = document.getElementById("pattern");
const spotsSelect = document.getElementById("spots");
const image = document.getElementById("sheepImage");
const description = document.getElementById("description");
const buttonsDiv = document.getElementById("sheepButtons");

// ==========================================
// DESCRIPTIONS
// ==========================================

const baseDescriptions = {
  Black: "Shetlands come in two base colors, black and brown. Black base color is dominant and a sheep only needs one copy of the black gene for it to show. Black base color produces black pigment in both wool and skin.",
  Brown: "Shetlands come in two base colors, black and brown. Brown base color is recessive and a sheep needs two copies of the brown gene for it to show. Breeding to a brown sheep can show if the other parent carries brown."
};

const patternDescriptions = {
  solid: "Patterns overlay the base color. Solid pattern shows the base color evenly throughout the body and is recessive to all other patterns.",
  white: "Patterns overlay the base color. White pattern covers the base color, leaving only small traces of the base color visible if any. The white pattern is dominant to all other patterns.",
  Katmoget: "Patterns overlay the base color. Katmoget pattern gives a light body with darker belly and face mask. It is co-dominant with Gulmoget and Fading, expressing both when paired together.",
  Gulmoget: "Patterns overlay the base color. Gulmoget pattern is the reverse of Katmoget — dark body with lighter belly and eye stripes. It is co-dominant with Katmoget and Fading, expressing both when paired together.",
  Fading: "Patterns overlay the base color. Fading pattern lightens with age, often starting darker at birth and becoming paler in the body. It is co-dominant with Katmoget and Gulmoget."
};

const spotDescriptions = {
  yes: "Spotting is recessive and a sheep needs two copies of the gene to show spots. Spotted sheep have random white or colored patches overlaying base and pattern. Even if your sheep is almost completely white, it is technically black or brown with a large white spot. Shetlands come in numerous different spotting patterns, most with names in the Shetland dialect describing the specific spotting pattern. Although you may be able to breed for spots, there is no way to breed for a specific spotting pattern.",
  no: "Spotting is recessive, so even if a sheep does not show spots, it may carry the spotting gene."
};

const explorerPatternToFilename = {
  solid: "Solid",
  white: "White",
  Katmoget: "Katmoget",
  Gulmoget: "Gulmoget",
  Fading: "Fading"
};

let currentBase = "";
let currentPattern = "";
let currentSpot = "";

function setImageSource(imgElement, fileName, altText) {
  imgElement.alt = altText;
  imgElement.src = `images/${fileName}`;
}

function updateImage() {
  if (!currentBase) {
    setImageSource(image, "Blank_.png", "Shetland sheep");
    return;
  }

  let fileName = currentBase;

  if (!currentPattern && !currentSpot) {
    fileName += "_";
  }

  if (currentPattern) {
    fileName += `_${explorerPatternToFilename[currentPattern]}`;
  }

  if (currentSpot === "yes") {
    fileName += "_Spot";
  }

  fileName += ".png";
  setImageSource(image, fileName, "Shetland sheep");
}

function updateDescription() {
  if (!currentBase) {
    description.innerHTML = `<p>Select a base color to start learning about Shetland sheep genetics.</p>`;
    buttonsDiv.classList.remove("visible");
    return;
  }

  let desc = "";

  if (currentBase && baseDescriptions[currentBase]) {
    desc += `<p>${baseDescriptions[currentBase]}</p>`;
  }

  if (currentPattern && patternDescriptions[currentPattern]) {
    desc += `<p>${patternDescriptions[currentPattern]}</p>`;
  }

  if (currentSpot && spotDescriptions[currentSpot]) {
    desc += `<p>${spotDescriptions[currentSpot]}</p>`;
  }

  description.innerHTML = desc;

  if (currentBase && currentPattern && currentSpot) {
    buttonsDiv.classList.add("visible");
  } else {
    buttonsDiv.classList.remove("visible");
  }
}

baseSelect.addEventListener("change", () => {
  currentBase = baseSelect.value;
  currentPattern = "";
  currentSpot = "";

  patternSelect.disabled = !currentBase;
  patternSelect.value = "";

  spotsSelect.disabled = true;
  spotsSelect.value = "";

  updateImage();
  updateDescription();
});

patternSelect.addEventListener("change", () => {
  currentPattern = patternSelect.value;
  currentSpot = "";

  spotsSelect.disabled = !currentPattern;
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
    <p>Great! This sheep matches the selection you made.</p>
    <p>Keep in mind, this is just the very basics of Shetland sheep color genetics. There are other factors like <strong>extension</strong>, <strong>intensity</strong>, and <strong>modifiers</strong> that can change the shade and pattern of the fleece in ways we haven't fully covered here.</p>
    <p>Use this as a starting point to explore more complex genetics and see how real-life sheep can vary even with the same base color and pattern.</p>
  `;
});

document.getElementById("buttonDifferent").addEventListener("click", () => {
  description.innerHTML = `
    <p>Hmm, your sheep looks different from the options selected.</p>
    <p>Remember, what we're showing here is just the basics of Shetland sheep color genetics. Real sheep can vary due to <strong>extension</strong>, <strong>intensity</strong>, and other <strong>modifiers</strong> that change how colors and patterns appear.</p>
    <p>This is a great opportunity to explore and compare your sheep to see how these additional genes influence the fleece.</p>
  `;
});


// ==========================================
// SECTION 2: BREEDING CALCULATOR
// ==========================================

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

// ==========================================
// DETERMINE EXPRESSED PATTERN & IMAGE
// ==========================================

function getPatternDetails(p1, p2) {
  // 1. White (Awt) is dominant over all patterns
  if (p1 === "Awt" || p2 === "Awt") {
    return {
      displayName: "White",
      fileName: "White"
    };
  }

  const alleles = [p1, p2];
  const hasAgt = alleles.includes("Agt");
  const hasAg = alleles.includes("Ag");
  const hasAb = alleles.includes("Ab");

  // Collect codominant alleles present
  const activePatterns = [];
  if (hasAgt) activePatterns.push("Gulmoget");
  if (hasAg) activePatterns.push("Greying");
  if (hasAb) activePatterns.push("Katmoget");

  // 2. Codominance logic between Agt, Ag, and Ab
  if (activePatterns.length > 1) {
    const displayName = activePatterns.join(" / ");

    // Standard visual image fallback priority
    let fileName = "Gulmoget";
    if (hasAgt) {
      fileName = "Gulmoget";
    } else if (hasAg) {
      fileName = "Fading";
    } else if (hasAb) {
      fileName = "Katmoget";
    }

    return { displayName, fileName };
  }

  // 3. Single pattern paired with itself or Solid (Aa)
  if (activePatterns.length === 1) {
    const patternName = activePatterns[0];
    let fileName = "Solid";

    if (patternName === "Gulmoget") fileName = "Gulmoget";
    if (patternName === "Greying") fileName = "Fading";
    if (patternName === "Katmoget") fileName = "Katmoget";

    return {
      displayName: patternName,
      fileName: fileName
    };
  }

  // 4. Default to Solid if both alleles are Aa
  return {
    displayName: "Solid",
    fileName: "Solid"
  };
}

// ==========================================
// UPDATE PARENT PREVIEW
// ==========================================

function updateParentPreview(baseElem, p1Elem, p2Elem, spotElem, targetImg, animalName) {
  const baseColor = baseElem.value === "bb" ? "Brown" : "Black";
  const patternDetails = getPatternDetails(p1Elem.value, p2Elem.value);
  const spotSuffix = spotElem.value === "ss" ? "_Spot" : "";

  const fileName = `${baseColor}_${patternDetails.fileName}${spotSuffix}.png`;

  setImageSource(targetImg, fileName, `${animalName} Phenotype`);
}

// ==========================================
// EVENT LISTENERS & INITIALIZATION
// ==========================================

[ramBase, ramPattern1, ramPattern2, ramSpot].forEach(element => {
  element.addEventListener("change", () => {
    updateParentPreview(ramBase, ramPattern1, ramPattern2, ramSpot, ramImage, "Ram");
  });
});

[eweBase, ewePattern1, ewePattern2, eweSpot].forEach(element => {
  element.addEventListener("change", () => {
    updateParentPreview(eweBase, ewePattern1, ewePattern2, eweSpot, eweImage, "Ewe");
  });
});

// Run previews on initial script load
updateParentPreview(ramBase, ramPattern1, ramPattern2, ramSpot, ramImage, "Ram");
updateParentPreview(eweBase, ewePattern1, ewePattern2, eweSpot, eweImage, "Ewe");

// ==========================================
// PUNNETT SQUARE COMBINATIONS
// ==========================================

function getCombos(a1, a2, b1, b2) {
  return [
    [a1, b1],
    [a1, b2],
    [a2, b1],
    [a2, b2]
  ];
}

// ==========================================
// CALCULATE OFFSPRING
// ==========================================

calculateBtn.addEventListener("click", () => {
  const ramB = ramBase.value.split("");
  const eweB = eweBase.value.split("");
  const baseCombos = getCombos(ramB[0], ramB[1], eweB[0], eweB[1]);

  const patternCombos = getCombos(
    ramPattern1.value,
    ramPattern2.value,
    ewePattern1.value,
    ewePattern2.value
  );

  const ramS = ramSpot.value.split("");
  const eweS = eweSpot.value.split("");
  const spotCombos = getCombos(ramS[0], ramS[1], eweS[0], eweS[1]);

  const outcomes = {};
  const totalCombos = baseCombos.length * patternCombos.length * spotCombos.length;

  baseCombos.forEach(basePair => {
    const isBrown = basePair[0] === "b" && basePair[1] === "b";
    const baseName = isBrown ? "Brown" : "Black";

    patternCombos.forEach(patternPair => {
      const patternDetails = getPatternDetails(patternPair[0], patternPair[1]);

      spotCombos.forEach(spotPair => {
        const isSpotted = spotPair[0] === "s" && spotPair[1] === "s";
        const spotSuffix = isSpotted ? "_Spot" : "";

        const label = `${baseName} ${patternDetails.displayName}` + (isSpotted ? " (Spotted)" : "");
        const imageSrc = `${baseName}_${patternDetails.fileName}${spotSuffix}.png`;

        if (!outcomes[label]) {
          outcomes[label] = {
            count: 0,
            imageSrc: imageSrc
          };
        }

        outcomes[label].count++;
      });
    });
  });

  resultsList.innerHTML = "";

  Object.keys(outcomes).forEach(key => {
    const probability = (outcomes[key].count / totalCombos) * 100;
    const percentage = Number.isInteger(probability)
      ? `${probability}%`
      : `${probability.toFixed(1)}%`;

    const card = document.createElement("div");
    card.className = "result-card";

    const resultImage = document.createElement("img");
    resultImage.alt = key;
    setImageSource(resultImage, outcomes[key].imageSrc, key);

    const heading = document.createElement("h4");
    heading.textContent = key;

    const probabilityText = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${percentage} Probability`;

    probabilityText.appendChild(strong);
    card.appendChild(resultImage);
    card.appendChild(heading);
    card.appendChild(probabilityText);

    resultsList.appendChild(card);
  });

  resultsContainer.hidden = false;
});
