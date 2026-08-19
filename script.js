// ==========================================
// SECTION 1: COLOR GENETICS EXPLORER
// ==========================================

const baseSelect =
  document.getElementById("baseColor");

const patternSelect =
  document.getElementById("pattern");

const spotsSelect =
  document.getElementById("spots");

const image =
  document.getElementById("sheepImage");

const description =
  document.getElementById("description");

const buttonsDiv =
  document.getElementById("sheepButtons");


// ==========================================
// DESCRIPTIONS
// ==========================================

const baseDescriptions = {

  Black:
    "Shetlands come in two base colors, black and brown. Black base color is dominant and a sheep only needs one copy of the black gene for it to show. Black base color produces black pigment in both wool and skin.",

  Brown:
    "Shetlands come in two base colors, black and brown. Brown base color is recessive and a sheep needs two copies of the brown gene for it to show. Breeding to a brown sheep can show if the other parent carries brown."

};


const patternDescriptions = {

  solid:
    "Patterns overlay the base color. Solid pattern shows the base color evenly throughout the body and is recessive to all other patterns.",

  white:
    "Patterns overlay the base color. White pattern covers the base color, leaving only small traces of the base color visible if any. The white pattern is dominant to all other patterns.",

  Katmoget:
    "Patterns overlay the base color. Katmoget pattern gives a light body with darker belly and face mask. It is dominant only to the solid pattern but is sometimes co-dominated with Gulmoget or Fading, creating a mixed pattern.",

  Gulmoget:
    "Patterns overlay the base color. Gulmoget pattern is the reverse of Katmoget — dark body with lighter belly and eye stripes. It is dominant to all other patterns except white.",

  Fading:
    "Patterns overlay the base color. Fading pattern lightens with age, often starting darker at birth and becoming paler in the body. It is dominant to Katmoget and Solid but recessive to Gulmoget and White."

};


const spotDescriptions = {

  yes:
    "Spotting is recessive and a sheep needs two copies of the gene to show spots. Spotted sheep have random white or colored patches overlaying base and pattern. Even if your sheep is almost completely white, it is technically black or brown with a large white spot. Shetlands come in numerous different spotting patterns, most with names in the Shetland dialect describing the specific spotting pattern. Although you may be able to breed for spots, there is no way to breed for a specific spotting pattern.",

  no:
    "Spotting is recessive, so even if a sheep does not show spots, it may carry the spotting gene."

};


// ==========================================
// EXPLORER PATTERN → IMAGE NAME
// ==========================================
//
// These match the actual filenames in
// your images folder.
//

const explorerPatternToFilename = {

  solid: "Solid",

  white: "White",

  Katmoget: "Katmoget",

  Gulmoget: "Gulmoget",

  Fading: "Fading"

};


// ==========================================
// CURRENT SELECTIONS
// ==========================================

let currentBase = "";

let currentPattern = "";

let currentSpot = "";


// ==========================================
// IMAGE LOADER
// ==========================================
//
// All images are inside the "images" folder.
//

function setImageSource(
  imgElement,
  fileName,
  altText
) {

  imgElement.alt = altText;

  imgElement.src =
    `images/${fileName}`;

}


// ==========================================
// UPDATE EXPLORER IMAGE
// ==========================================

function updateImage() {

  if (!currentBase) {

    setImageSource(
      image,
      "Blank_.png",
      "Shetland sheep"
    );

    return;
  }


  let fileName =
    currentBase;


  // ==========================================
  // BASE COLOR ONLY
  // ==========================================
  //
  // Black_.png
  // Brown_.png
  //

  if (
    !currentPattern &&
    !currentSpot
  ) {

    fileName += "_";

  }


  // ==========================================
  // PATTERN
  // ==========================================
  //
  // Black_Solid.png
  // Black_White.png
  // Black_Katmoget.png
  // etc.
  //

  if (currentPattern) {

    fileName +=
      `_${explorerPatternToFilename[currentPattern]}`;

  }


  // ==========================================
  // SPOTTING
  // ==========================================
  //
  // Actual filename uses "_Spot"
  //

  if (currentSpot === "yes") {

    fileName += "_Spot";

  }


  fileName += ".png";


  setImageSource(
    image,
    fileName,
    "Shetland sheep"
  );

}


// ==========================================
// UPDATE DESCRIPTION
// ==========================================
//
// Each selection gets its own paragraph.
//
// Example:
//
// Base color paragraph
//
// Pattern paragraph
//
// Spotting paragraph
//
// The paragraphs remain stacked together.
//

function updateDescription() {

  // ==========================================
  // NOTHING SELECTED
  // ==========================================

  if (!currentBase) {

    description.innerHTML = `
      <p>
        Select a base color to start learning about
        Shetland sheep genetics.
      </p>
    `;

    buttonsDiv.classList.remove("visible");

    return;

  }


  let desc = "";


  // ==========================================
  // BASE COLOR PARAGRAPH
  // ==========================================

  if (
    currentBase &&
    baseDescriptions[currentBase]
  ) {

    desc += `
      <p>
        ${baseDescriptions[currentBase]}
      </p>
    `;

  }


  // ==========================================
  // PATTERN PARAGRAPH
  // ==========================================

  if (
    currentPattern &&
    patternDescriptions[currentPattern]
  ) {

    desc += `
      <p>
        ${patternDescriptions[currentPattern]}
      </p>
    `;

  }


  // ==========================================
  // SPOTTING PARAGRAPH
  // ==========================================

  if (
    currentSpot &&
    spotDescriptions[currentSpot]
  ) {

    desc += `
      <p>
        ${spotDescriptions[currentSpot]}
      </p>
    `;

  }


  // ==========================================
  // DISPLAY ALL PARAGRAPHS
  // ==========================================

  description.innerHTML =
    desc;


  // ==========================================
  // SHOW / HIDE SHEEP BUTTONS
  // ==========================================
  //
  // The CSS controls the actual display.
  // We only add/remove the "visible" class.
  //

  if (
    currentBase &&
    currentPattern &&
    currentSpot
  ) {

    buttonsDiv.classList.add("visible");

  } else {

    buttonsDiv.classList.remove("visible");

  }

}


// ==========================================
// BASE COLOR CHANGE
// ==========================================

baseSelect.addEventListener(
  "change",
  () => {

    currentBase =
      baseSelect.value;

    // Changing the base color resets
    // the pattern and spotting choices.

    currentPattern = "";

    currentSpot = "";


    // Enable pattern selection.

    patternSelect.disabled =
      !currentBase;

    patternSelect.value =
      "";


    // Spotting remains disabled until
    // a pattern is selected.

    spotsSelect.disabled =
      true;

    spotsSelect.value =
      "";


    updateImage();

    updateDescription();

  }
);


// ==========================================
// PATTERN CHANGE
// ==========================================

patternSelect.addEventListener(
  "change",
  () => {

    currentPattern =
      patternSelect.value;

    // Changing the pattern resets spotting.

    currentSpot = "";


    // Enable spotting selection.

    spotsSelect.disabled =
      !currentPattern;

    spotsSelect.value =
      "";


    updateImage();

    updateDescription();

  }
);


// ==========================================
// SPOTTING CHANGE
// ==========================================

spotsSelect.addEventListener(
  "change",
  () => {

    currentSpot =
      spotsSelect.value;


    updateImage();

    updateDescription();

  }
);


// ==========================================
// "THIS IS MY SHEEP"
// ==========================================

document
  .getElementById("buttonThis")
  .addEventListener(
    "click",
    () => {

      description.innerHTML = `

        <p>
          Great! This sheep matches the selection you made.
        </p>

        <p>
          Keep in mind, this is just the very basics of
          Shetland sheep color genetics. There are other
          factors like <strong>extension</strong>,
          <strong>intensity</strong>, and
          <strong>modifiers</strong> that can change the
          shade and pattern of the fleece in ways we
          haven't fully covered here.
        </p>

        <p>
          Use this as a starting point to explore more
          complex genetics and see how real-life sheep
          can vary even with the same base color and pattern.
        </p>

      `;

    }
  );


// ==========================================
// "MY SHEEP LOOKS DIFFERENT"
// ==========================================

document
  .getElementById("buttonDifferent")
  .addEventListener(
    "click",
    () => {

      description.innerHTML = `

        <p>
          Hmm, your sheep looks different from the
          options selected.
        </p>

        <p>
          Remember, what we're showing here is just
          the basics of Shetland sheep color genetics.
          Real sheep can vary due to
          <strong>extension</strong>,
          <strong>intensity</strong>, and other
          <strong>modifiers</strong> that change how
          colors and patterns appear.
        </p>

        <p>
          This is a great opportunity to explore and
          compare your sheep to see how these additional
          genes influence the fleece.
        </p>

      `;

    }
  );


// ==========================================
// SECTION 2: BREEDING CALCULATOR
// ==========================================


// ==========================================
// PATTERN DOMINANCE HIERARCHY
// ==========================================
//
// White > Gulmoget > Greying > Katmoget > Solid
//

const patternRank = {

  Awt: 5,

  Agt: 4,

  Ag: 3,

  Ab: 2,

  Aa: 1

};


// ==========================================
// PATTERN → IMAGE FILENAME
// ==========================================
//
// These match the actual image filenames.
//

const patternToFilename = {

  Awt: "White",

  Agt: "Gulmoget",

  Ag: "Fading",

  Ab: "Katmoget",

  Aa: "Solid"

};


// ==========================================
// PATTERN DISPLAY NAMES
// ==========================================

const patternDisplayName = {

  Awt: "White",

  Agt: "Gulmoget",

  Ag: "Greying",

  Ab: "Katmoget",

  Aa: "Solid"

};


// ==========================================
// PARENT ELEMENTS
// ==========================================

const ramBase =
  document.getElementById("ramBase");

const ramPattern1 =
  document.getElementById("ramPattern1");

const ramPattern2 =
  document.getElementById("ramPattern2");

const ramSpot =
  document.getElementById("ramSpot");

const ramImage =
  document.getElementById("ramImage");


const eweBase =
  document.getElementById("eweBase");

const ewePattern1 =
  document.getElementById("ewePattern1");

const ewePattern2 =
  document.getElementById("ewePattern2");

const eweSpot =
  document.getElementById("eweSpot");

const eweImage =
  document.getElementById("eweImage");


const calculateBtn =
  document.getElementById("calculateBreed");

const resultsContainer =
  document.getElementById("breedingResults");

const resultsList =
  document.getElementById("resultsList");


// ==========================================
// DETERMINE EXPRESSED PATTERN
// ==========================================

function getExpressedPattern(
  p1,
  p2
) {

  const r1 =
    patternRank[p1];

  const r2 =
    patternRank[p2];


  return r1 >= r2
    ? p1
    : p2;

}


// ==========================================
// UPDATE PARENT IMAGE
// ==========================================

function updateParentPreview(
  baseElem,
  p1Elem,
  p2Elem,
  spotElem,
  targetImg,
  animalName
) {

  const baseColor =
    baseElem.value === "bb"
      ? "Brown"
      : "Black";


  const expressedAllele =
    getExpressedPattern(
      p1Elem.value,
      p2Elem.value
    );


  const patternFile =
    patternToFilename[
      expressedAllele
    ];


  // Actual spotted files use
  // "_Spot", with a capital S.

  const spotSuffix =
    spotElem.value === "ss"
      ? "_Spot"
      : "";


  const fileName =
    `${baseColor}_${patternFile}${spotSuffix}.png`;


  setImageSource(
    targetImg,
    fileName,
    `${animalName} Phenotype`
  );

}


// ==========================================
// RAM EVENT LISTENERS
// ==========================================

[
  ramBase,
  ramPattern1,
  ramPattern2,
  ramSpot

].forEach(
  element => {

    element.addEventListener(
      "change",
      () => {

        updateParentPreview(
          ramBase,
          ramPattern1,
          ramPattern2,
          ramSpot,
          ramImage,
          "Ram"
        );

      }
    );

  }
);


// ==========================================
// EWE EVENT LISTENERS
// ==========================================

[
  eweBase,
  ewePattern1,
  ewePattern2,
  eweSpot

].forEach(
  element => {

    element.addEventListener(
      "change",
      () => {

        updateParentPreview(
          eweBase,
          ewePattern1,
          ewePattern2,
          eweSpot,
          eweImage,
          "Ewe"
        );

      }
    );

  }
);


// ==========================================
// INITIAL PARENT IMAGES
// ==========================================
//
// Default genotype:
//
// BB
// Awt / Aa
// SS
//
// Awt is dominant, so the default image
// should be Black_White.png.
//

updateParentPreview(
  ramBase,
  ramPattern1,
  ramPattern2,
  ramSpot,
  ramImage,
  "Ram"
);


updateParentPreview(
  eweBase,
  ewePattern1,
  ewePattern2,
  eweSpot,
  eweImage,
  "Ewe"
);


// ==========================================
// PUNNETT SQUARE COMBINATIONS
// ==========================================

function getCombos(
  a1,
  a2,
  b1,
  b2
) {

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

calculateBtn.addEventListener(
  "click",
  () => {


    // ======================================
    // BASE COLOR
    // ======================================

    const ramB =
      ramBase.value.split("");

    const eweB =
      eweBase.value.split("");


    const baseCombos =
      getCombos(
        ramB[0],
        ramB[1],
        eweB[0],
        eweB[1]
      );


    // ======================================
    // PATTERN
    // ======================================

    const patternCombos =
      getCombos(
        ramPattern1.value,
        ramPattern2.value,
        ewePattern1.value,
        ewePattern2.value
      );


    // ======================================
    // SPOTTING
    // ======================================

    const ramS =
      ramSpot.value.split("");

    const eweS =
      eweSpot.value.split("");


    const spotCombos =
      getCombos(
        ramS[0],
        ramS[1],
        eweS[0],
        eweS[1]
      );


    // ======================================
    // OUTCOMES
    // ======================================

    const outcomes = {};


    const totalCombos =
      baseCombos.length *
      patternCombos.length *
      spotCombos.length;


    // ======================================
    // GENERATE ALL COMBINATIONS
    // ======================================

    baseCombos.forEach(
      basePair => {

        const isBrown =
          basePair[0] === "b" &&
          basePair[1] === "b";


        const baseName =
          isBrown
            ? "Brown"
            : "Black";


        patternCombos.forEach(
          patternPair => {

            const expressedAllele =
              getExpressedPattern(
                patternPair[0],
                patternPair[1]
              );


            const patternFile =
              patternToFilename[
                expressedAllele
              ];


            const displayPattern =
              patternDisplayName[
                expressedAllele
              ];


            spotCombos.forEach(
              spotPair => {

                const isSpotted =
                  spotPair[0] === "s" &&
                  spotPair[1] === "s";


                const spotSuffix =
                  isSpotted
                    ? "_Spot"
                    : "";


                const label =
                  `${baseName} ${displayPattern}` +
                  (
                    isSpotted
                      ? " (Spotted)"
                      : ""
                  );


                const imageSrc =
                  `${baseName}_${patternFile}${spotSuffix}.png`;


                if (!outcomes[label]) {

                  outcomes[label] = {

                    count: 0,

                    imageSrc:
                      imageSrc

                  };

                }


                outcomes[label].count++;

              }
            );

          }
        );

      }
    );


    // ======================================
    // DISPLAY RESULTS
    // ======================================

    resultsList.innerHTML = "";


    Object.keys(outcomes).forEach(
      key => {

        const probability =
          (
            outcomes[key].count /
            totalCombos
          ) * 100;


        const percentage =
          Number.isInteger(probability)
            ? `${probability}%`
            : `${probability.toFixed(1)}%`;


        // ==================================
        // CREATE RESULT CARD
        // ==================================

        const card =
          document.createElement("div");

        card.className =
          "result-card";


        // ==================================
        // CREATE IMAGE
        // ==================================

        const resultImage =
          document.createElement("img");

        resultImage.alt =
          key;


        setImageSource(
          resultImage,
          outcomes[key].imageSrc,
          key
        );


        // ==================================
        // CREATE HEADING
        // ==================================

        const heading =
          document.createElement("h4");

        heading.textContent =
          key;


        // ==================================
        // CREATE PROBABILITY TEXT
        // ==================================

        const probabilityText =
          document.createElement("p");


        const strong =
          document.createElement("strong");


        strong.textContent =
          `${percentage} Probability`;


        probabilityText.appendChild(
          strong
        );


        // ==================================
        // ASSEMBLE CARD
        // ==================================

        card.appendChild(
          resultImage
        );

        card.appendChild(
          heading
        );

        card.appendChild(
          probabilityText
        );


        // ==================================
        // ADD CARD TO RESULTS
        // ==================================

        resultsList.appendChild(
          card
        );

      }
    );


    // ======================================
    // SHOW RESULTS
    // ======================================

    resultsContainer.hidden =
      false;

  }
);
