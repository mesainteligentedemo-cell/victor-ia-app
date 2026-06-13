/**
 * AI Features Service
 * GPT-4 integration for document intelligence
 * Auto-complete, summarization, translation, grammar checking
 */

export interface AICompletionResult {
  text: string;
  tokens: number;
  confidence: number;
}

export interface AISummaryResult {
  summary: string;
  keyPoints: string[];
  wordCount: number;
}

export interface AITranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AIGrammarResult {
  originalText: string;
  correctedText: string;
  corrections: {
    original: string;
    corrected: string;
    type: 'grammar' | 'spelling' | 'punctuation' | 'style';
    explanation: string;
  }[];
}

export interface AISuggestion {
  id: string;
  type: 'expansion' | 'rewrite' | 'tone' | 'clarity';
  original: string;
  suggestion: string;
  explanation: string;
  confidence: number;
}

class AIFeaturesService {
  private apiKey: string;
  private baseURL = 'https://api.openai.com/v1';
  private model = 'gpt-4-turbo-preview';
  private maxTokens = 2000;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Auto-complete text based on context
   */
  async autoComplete(
    context: string,
    maxSuggestions: number = 3
  ): Promise<AICompletionResult[]> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a writing assistant. Complete the text naturally and concisely.',
            },
            {
              role: 'user',
              content: `Complete this text with ${maxSuggestions} options:\n\n${context}`,
            },
          ],
          temperature: 0.7,
          max_tokens: this.maxTokens,
          n: maxSuggestions,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();

      return data.choices.map((choice: any) => ({
        text: choice.message.content.trim(),
        tokens: choice.usage?.completion_tokens || 0,
        confidence: 0.85, // Default confidence
      }));
    } catch (error) {
      console.error('Auto-complete failed:', error);
      throw error;
    }
  }

  /**
   * Summarize document content
   */
  async summarize(text: string, style: 'bullet' | 'paragraph' = 'paragraph'): Promise<AISummaryResult> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a document summarization expert. Create concise, informative summaries.',
            },
            {
              role: 'user',
              content: `Summarize this text in ${style} format. Also extract key points:\n\n${text}`,
            },
          ],
          temperature: 0.5,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const summary = data.choices[0].message.content;

      // Extract key points (simplified - in real app would parse better)
      const keyPoints = summary
        .split('\n')
        .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
        .map((line: string) => line.replace(/^[-•]\s*/, '').trim())
        .filter((line: string) => line.length > 0);

      return {
        summary,
        keyPoints: keyPoints.length > 0 ? keyPoints : [summary.split('.')[0]],
        wordCount: text.split(/\s+/).length,
      };
    } catch (error) {
      console.error('Summarization failed:', error);
      throw error;
    }
  }

  /**
   * Translate text to another language
   */
  async translate(text: string, targetLanguage: string): Promise<AITranslationResult> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate to ${targetLanguage} while preserving tone and meaning.`,
            },
            {
              role: 'user',
              content: `Translate this text to ${targetLanguage}:\n\n${text}`,
            },
          ],
          temperature: 0.3,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const translatedText = data.choices[0].message.content;

      return {
        originalText: text,
        translatedText,
        sourceLanguage: 'auto', // Would detect in real app
        targetLanguage,
      };
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  /**
   * Check and correct grammar
   */
  async checkGrammar(text: string): Promise<AIGrammarResult> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content:
                'You are a grammar expert. Check for grammar, spelling, and punctuation errors. Return corrected text and list each correction.',
            },
            {
              role: 'user',
              content: `Check grammar and provide corrections:\n\n${text}`,
            },
          ],
          temperature: 0.3,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const responseText = data.choices[0].message.content;

      // Parse corrections (simplified)
      const corrections = [];

      return {
        originalText: text,
        correctedText: responseText,
        corrections,
      };
    } catch (error) {
      console.error('Grammar check failed:', error);
      throw error;
    }
  }

  /**
   * Get smart suggestions for improving text
   */
  async getSuggestions(text: string, type: 'tone' | 'clarity' | 'expansion' = 'clarity'): Promise<AISuggestion[]> {
    try {
      const prompts: Record<string, string> = {
        clarity: 'Make this text clearer and more concise',
        tone: 'Improve the tone to be more professional',
        expansion: 'Expand this text with more details and examples',
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a writing coach. Provide 3 suggestions to ${prompts[type]}. Format as bullet points with explanations.`,
            },
            {
              role: 'user',
              content: `${prompts[type]}:\n\n${text}`,
            },
          ],
          temperature: 0.7,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const suggestions = data.choices[0].message.content;

      // Parse suggestions (simplified)
      const parsed: AISuggestion[] = [];

      return parsed.length > 0
        ? parsed
        : [
            {
              id: '1',
              type,
              original: text,
              suggestion: suggestions,
              explanation: 'AI-generated suggestion',
              confidence: 0.8,
            },
          ];
    } catch (error) {
      console.error('Suggestions failed:', error);
      throw error;
    }
  }

  /**
   * Generate document title from content
   */
  async generateTitle(content: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Generate a concise, descriptive title for a document.',
            },
            {
              role: 'user',
              content: `Generate a title for this content:\n\n${content.substring(0, 1000)}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Title generation failed:', error);
      throw error;
    }
  }

  /**
   * Explain a concept in the document
   */
  async explainConcept(concept: string, context?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Explain concepts clearly and concisely.',
            },
            {
              role: 'user',
              content: `Explain "${concept}"${context ? ` in the context of: ${context}` : ''}`,
            },
          ],
          temperature: 0.7,
          max_tokens: this.maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Concept explanation failed:', error);
      throw error;
    }
  }
}

export default AIFeaturesService;