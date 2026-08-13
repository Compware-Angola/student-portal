
import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

const CP1252_HIGH_RANGE: Record<number, number> = {
  0x80: 0x20ac, 0x82: 0x201a, 0x83: 0x0192, 0x84: 0x201e, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02c6, 0x89: 0x2030, 0x8a: 0x0160,
  0x8b: 0x2039, 0x8c: 0x0152, 0x8e: 0x017d, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201c, 0x94: 0x201d, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02dc, 0x99: 0x2122, 0x9a: 0x0161, 0x9b: 0x203a, 0x9c: 0x0153,
  0x9e: 0x017e, 0x9f: 0x0178,
};

export function decodeLegacyHexEscapes(text: string): string {
  if (!text) return text;
  return text.replace(/\^\^([0-9a-fA-F]{2})/g, (match, hex: string) => {
    const byte = parseInt(hex, 16);
    const codePoint = CP1252_HIGH_RANGE[byte] ?? byte;
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      return match;
    }
  });
}


const ACUTE_MAP: Record<string, string> = { a: "á", e: "é", i: "í", o: "ó", u: "ú", A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú" };
const GRAVE_MAP: Record<string, string> = { a: "à", A: "À" };
const TILDE_MAP: Record<string, string> = { a: "ã", o: "õ", A: "Ã", O: "Õ" };
const CIRCUMFLEX_MAP: Record<string, string> = { a: "â", e: "ê", o: "ô", A: "Â", E: "Ê", O: "Ô" };
const CEDILLA_MAP: Record<string, string> = { c: "ç", C: "Ç" };

// Some sources encode accents as base letter + a trailing spacing-modifier
// character/command (U+02CA acute, U+02CB grave, literal ^ / ~, or the LaTeX
// cedilla command \c) instead of a single precomposed glyph. Compose them
// back before any math/text classification happens, otherwise the stray
// ^ / ~ / \c get misread as math operators.
export function composeSpacingModifierAccents(text: string): string {
  if (!text) return text;
  return text
    .replace(/([aeiouAEIOU])\u02CA/g, (_, v: string) => ACUTE_MAP[v] ?? v)
    .replace(/([aeiouAEIOU])\u02CB/g, (_, v: string) => GRAVE_MAP[v] ?? v)
    .replace(/([aeiouAEIOU])~/g, (_, v: string) => TILDE_MAP[v] ?? v)
    .replace(/([aeiouAEIOU])\^/g, (_, v: string) => CIRCUMFLEX_MAP[v] ?? v)
    .replace(/([cC])\\c/g, (_, c: string) => CEDILLA_MAP[c] ?? c);
}

const ENCODING_MAP: Record<string, string> = {
  "\\^\\^e1": "á", "\\^\\^e9": "é", "\\^\\^ed": "í", "\\^\\^f3": "ó", "\\^\\^fa": "ú",
  "\\^\\^e0": "à", "\\^\\^e2": "â", "\\^\\^ea": "ê", "\\^\\^f4": "ô",
  "\\^\\^e3": "ã", "\\^\\^f5": "õ", "\\^\\^e7": "ç",
  "\\^\\^c1": "Á", "\\^\\^c9": "É", "\\^\\^cd": "Í", "\\^\\^d3": "Ó", "\\^\\^da": "Ú",
  "\\^\\^c3": "Ã", "\\^\\^c7": "Ç",
  "\\^\\^\\^\\^221b": "\\sqrt",
  "\\^\\^\\^\\^221c": "\\sqrt",
  "\\^\\^\\^\\^2061": "",
  "\\\\imaginaryI": "i",
  "\\s\\.\\s": " \\cdot ",
  "√": "\\sqrt",
  "\\\\ldots": "...",
};

function robustClean(text: string): string {
 
  if (!text) return "";
  let cleaned = text;

  Object.entries(ENCODING_MAP).forEach(([pattern, replacement]) => {
    cleaned = cleaned.replace(new RegExp(pattern, "g"), replacement);
  });

  return cleaned
    .replace(/\^(\})+/g, "$1")
    .replace(/s\^?\}\^?\{?2\}?/g, "s^{2}")
    .replace(/\\sqrt\[\{(\d+)\}\]/g, "\\sqrt[$1]")
    .replace(/\\sqrt\s*(\d+)/g, "\\sqrt{$1}")
    .replace(/\\sqrt\[(\d+)\](\d+)/g, "\\sqrt[$1]{$2}")
    .replace(/\\surd\s*(\d+)/g, "\\sqrt{$1}")
    .replace(/(\w|\})\s*\^\s*(\w+)/g, "$1^{$2}")
    .replace(/(\w|\})\s*\^\s*([A-Za-z0-9]+)/g, "$1^{$2}")   // was \w+
    .replace(/(\w|\})\s*_\s*([A-Za-z0-9]+)/g, "$1_{$2}")    // was \w+
    .replace(/(\w|\})\s*_\s*(\w+)/g, "$1_{$2}")
    .replace(/\\lparen/g, "(")
    .replace(/\\rparen/g, ")")
    .replace(/\\\\\\/g, "\\")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function LatexText({ text }: { text: string }) {
  if (!text.trim()) return null;

  const decodedText = composeSpacingModifierAccents(decodeLegacyHexEscapes(text));
  const cleanedText = robustClean(decodedText);

  // REGEX MELHORADA: Preserva os delimitadores $...$ ou $$...$$ e separa-os do resto do texto
  // Também isola comandos \text, \operatorname, \ce e quebras de linha \\
  const tokens = cleanedText.split(/(\$\$.*?\$\$|\$.*?\$|\\text\s*\{[^}]+\}|\\operatorname\s*\{[^}]+\}|\\ce\s*\{[^}]+\}|\\\\)/g);

  return (
    <span style={{ display: "inline", whiteSpace: "normal", wordBreak: "break-word", lineHeight: "1.6" }}>
      {tokens.map((token, index) => {
        if (!token) return null;

        // 1. Força a renderização se o token estiver explicitamente envolvido em $ ou $$
        if (token.startsWith("$")) {
          // Remove os caracteres $ externos do token para passar ao KaTeX
          const mathContent = token.replace(/^(\$\$?)/, "").replace(/(\$\$?)$/, "").trim();
          if (!mathContent) return null;
          try {
            return (
              <span key={index} style={{ display: "inline-block", margin: "0 2px", verticalAlign: "middle" }}>
                <InlineMath math={mathContent} />
              </span>
            );
          } catch {
            return <span key={index}>{mathContent}</span>;
          }
        }

        // 2. Gerencia quebras de linha explícitas (\\)
        if (token === "\\\\") {
          return <br key={index} />;
        }

        // 3. Processa blocos explícitos de texto LaTeX: \text{...}
        if (token.startsWith("\\text")) {
          const textContent = token.replace(/\\text\s*\{([\s\S]*)\}/, "$1");
          return <span key={index}>{textContent}</span>;
        }

        // 4. Processa comandos de Química estrutural: \ce{...}
        if (token.startsWith("\\ce")) {
          try {
            return (
              <span key={index} style={{ display: "inline-block", verticalAlign: "middle" }}>
                <InlineMath math={token} />
              </span>
            );
          } catch {
            const ceRaw = token.replace(/\\ce\s*\{([\s\S]*)\}/, "$1");
            return <span key={index} style={{ fontFamily: "sans-serif" }}>{ceRaw}</span>;
          }
        }

        // 5. Processa operadores especiais como \operatorname{...}
        if (token.startsWith("\\operatorname")) {
          const opContent = token.replace(/\\operatorname\s*\{([\s\S]*)\}/, "$1");
          return <span key={index} style={{ fontStyle: "normal", fontWeight: "bold" }}>{opContent}</span>;
        }

        const trimmed = token.trim();
        if (!trimmed) return null;

        // 6. DECISÃO AUTOMÁTICA PARA TEXTOS SOLTOS (SEM DELIMITADORES)
        const hasMathOrChemistryIndicators =
          /[\\^_{}=√→⇄]/.test(trimmed) ||
          /[-\+\*\/]\s*\d|\d\s*[-\+\*\/]/.test(trimmed) ||
          /^[A-Z][a-z]?\d+/.test(trimmed);

        const hasLongWords = /[a-zA-ZáàâãéèêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]{3,}/.test(trimmed);

        if (hasLongWords && !hasMathOrChemistryIndicators) {
          return <span key={index}>{token}</span>;
        }

        // 7. Fallback para fórmulas soltas descobertas
        try {
          return (
            <span key={index} style={{ display: "inline-block", margin: "0 2px", verticalAlign: "middle" }}>
              <InlineMath math={trimmed} />
            </span>
          );
        } catch (error) {
          console.warn("KaTeX bypass:", trimmed, error);
          return <span key={index}>{token}</span>;
        }
      })}
    </span>
  );
}
