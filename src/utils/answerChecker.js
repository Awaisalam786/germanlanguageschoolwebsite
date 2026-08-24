export function checkAnswerMatch(userInput, acceptedAnswers, options = {}) {
  const {
    isGerman = false,
    isEnglish = false,
  } = options;

  // STEP 1 - BASIC NORMALIZATION
  const normalizeBasic = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[.,!?;:"'””‘’]+$/g, '')
      .normalize('NFC');
  };

  const normalizedInput = normalizeBasic(userInput);
  const normalizedAccepted = acceptedAnswers.map(normalizeBasic);

  // STEP 2 - EXACT MATCH CHECK
  if (normalizedAccepted.includes(normalizedInput)) {
    return true;
  }

  // STEP 5 - "TO X" / "X" EQUIVALENCE CHECK (for English)
  if (isEnglish) {
    const stripTo = (str) => {
      if (str.startsWith('to ')) {
        return str.substring(3).trim();
      }
      return str;
    };
    
    const inputStripped = stripTo(normalizedInput);
    
    for (const accepted of normalizedAccepted) {
      if (inputStripped === stripTo(accepted)) {
        return true;
      }
    }
  }

  // STEP 3 & 4 - GERMAN SPECIFIC CHECKS
  if (isGerman) {
    const getVariants = (str) => {
      const vars = new Set();
      
      const stripArticle = (s) => s.replace(/^(der|die|das)\s+/i, '').trim();
      const replaceSs = (s) => s.replace(/ß/g, 'ss');

      const noArticle = stripArticle(str);
      const withSs = replaceSs(str);
      const noArticleWithSs = replaceSs(noArticle);

      vars.add(str);
      vars.add(noArticle);
      vars.add(withSs);
      vars.add(noArticleWithSs);

      return Array.from(vars);
    };

    const inputVariants = getVariants(normalizedInput);
    
    for (const accepted of normalizedAccepted) {
      const acceptedVariants = getVariants(accepted);
      
      for (const iv of inputVariants) {
        if (acceptedVariants.includes(iv)) return true;
      }
    }
  }

  // STEP 6 - IF ALL STEPS FAIL
  return false;
}
