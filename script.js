// ===== Get HTML elements =====
const baseSelect = document.getElementById("baseColor");
const patternSelect = document.getElementById("pattern");
const spotsSelect = document.getElementById("spots");
const image = document.getElementById("sheepImage");
const description = document.getElementById("description");
const buttonsContainer = document.querySelector(".image-buttons-container");
const buttonThis = document.getElementById("buttonThis");
const buttonDifferent = document.getElementById("buttonDifferent");

// ===== Default state =====
image.src = "images/Blank_.png";
description.textContent = "Select a base color to start learning about Shetland sheep genetics.";
buttonsContainer.style.display = "none"; // hide buttons initially

// ===== Descriptions =====
const baseDescriptions = {
  Black: "Shetlands come in two base colors, black and brown. Black base color is dominant and a sheep only needs one copy of the black gene for it to show.",
  Brown: "Shetlands come in two base colors, black and brown. Brown base color is recessive and a sheep needs two copies of the brown gene for it to show. Breeding to a brown sheep can show if the other parent carries brown."
};

const patternDescriptions = {
  Solid: "Patterns overlay the base color. Solid pattern shows the base color evenly throughout the body and is recessive to all other patterns.",
  White: "Patterns overlay the base color. White pattern covers the base color, leaving only small traces visible. The white pattern is dominant to all other patterns.",
  Katmoget: "Katmoget pattern gives a light body with darker belly and face mask. It is dominant only to the solid pattern but is very common. It is sometimes co-dominant with Gulmoget or Fading creating a mixed pattern.",
  Gulmoget: "Gulmoget pattern is the reverse of Katmoget — dark body with lighter belly and eye stripes. It is dominant to all other patterns except white.",
  Fading: "Fading pattern lightens with age, often starting darker at birth and becoming paler. It is dominant to Katmoget and Solid but recessive to Gulmoget and White."
};

const spotDescriptions = {
  yes: "Spotting is recessive and a sheep needs two copies of the gene to show spots. Spotted sheep have random white or colored patches overlaying base and pattern. Even if your sheep is almost completely white, it is technically black or brown with a large white spot. Shetlands come in numerous spotting patterns, most have names in the Shetland dialect. Although you may be able to breed for spots, there is no way to breed for a specific spotting pattern.",
  no: "Spotting is recessive, so even if a sheep does not show spots, it may carry the spotting gene."
};

// ===== Track current selections =====
let currentBase = "";
let currentPattern = "";
let currentSpot = "";

// ===== Update the image based on selections =====
function updateImage() {
  if (!currentBase) {
    image.src = "images/Blank_.png"; // default image before selection
    return;
  }

  let fileName = currentBase;

  fileName += currentPattern ? `_${currentPattern}` : "_";
  fileName += currentSpot === "yes" ? "_Spot" : "";
  fileName += ".png";

  image.src = `images/${fileName}`;
}

// ===== Update the description text =====
function updateDescription() {
  let desc = "";

  if (currentBase && baseDescriptions[currentBase]) desc += `<span class="desc-part">${baseDescriptions[currentBase]}</span> `;
  if (currentPattern && patternDescriptions[currentPattern]) desc += `<span class="desc-part">${patternDescriptions[currentPattern]}</span> `;
  if (currentSpot && spotDescriptions[currentSpot]) desc += `<span class="desc-part">${spotDescriptions[currentSpot]}</span>`;

  description.innerHTML = desc || "Select a base color to start learning about Shetland sheep genetics.";

  // Show buttons only when all selections are made
  buttonsContainer.style.display = (currentBase && currentPattern && currentSpot) ? "flex" : "none";
}

// ===== Event listeners for dropdowns =====
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

const buttonsDiv = document.getElementById("sheepButtons");

if (currentBase && currentPattern && currentSpot) {
  buttonsDiv.style.display = "block"; // show buttons
} else {
  buttonsDiv.style.display = "none";  // hide buttons if selection is incomplete
}
document.getElementById("buttonThis").addEventListener("click", () => {
  alert("Great! This is your sheep."); // replace with any action you want
});

document.getElementById("buttonDifferent").addEventListener("click", () => {
  alert("Okay! Maybe your sheep has a unique pattern."); // replace with any action
});

