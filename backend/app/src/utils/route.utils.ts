import { Multipart } from '@fastify/multipart';

const MAX_PROMPT_LENGTH = 500;

/**
 * Sanitize user prompt to prevent injection attacks
 */
const sanitizeUserPrompt = (prompt: string): string => {
  let sanitized = prompt.trim().substring(0, MAX_PROMPT_LENGTH);

  // Remove injection patterns
  const injectionPatterns = [
    /ignore\s+(previous|above|all)\s+instructions?/gi,
    /disregard\s+(previous|above|all)\s+instructions?/gi,
    /forget\s+(everything|all|previous)/gi,
    /you\s+are\s+now/gi,
    /act\s+as\s+if/gi,
    /pretend\s+(to\s+be|you\s+are)/gi,
    /system\s*:/gi,
    /\[INST\]/gi,
    /\[\/?INST\]/gi,
    /<\/?system>/gi,
    /new\s+instructions?:/gi,
    /override\s+(previous|all)/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove potentially dangerous characters
  return sanitized.replace(/[<>{}[\]\\]/g, '').trim();
};

interface ParsedMultipartData {
  fileBuffer: Buffer | null;
  fileMimetype: string | null;
  fileFilename: string | null;
  userPrompt: string | undefined;
}

/**
 * Parse multipart request to extract file and optional prompt field.
 * Must consume file stream before iterator can proceed to next part.
 */
const parseMultipartWithPrompt = async (
  parts: AsyncIterableIterator<Multipart>
): Promise<ParsedMultipartData> => {
  let fileBuffer: Buffer | null = null;
  let fileMimetype: string | null = null;
  let fileFilename: string | null = null;
  let userPrompt: string | undefined;

  for await (const part of parts) {
    if (part.type === 'file') {
      // Must consume the stream before iterator can proceed to next part
      fileBuffer = await part.toBuffer();
      fileMimetype = part.mimetype;
      fileFilename = part.filename;
    } else if (part.type === 'field' && part.fieldname === 'prompt') {
      const rawValue = part.value;
      if (typeof rawValue === 'string' && rawValue.trim()) {
        userPrompt = sanitizeUserPrompt(rawValue);
      }
    }
  }

  return { fileBuffer, fileMimetype, fileFilename, userPrompt };
};

export { parseMultipartWithPrompt, ParsedMultipartData, sanitizeUserPrompt };
