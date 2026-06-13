/**
 * Rich Text Formatting Engine
 * Supports: bold, italic, code, links, lists
 * Stored as markdown, rendered as HTML
 */

export interface TextFormat {
  start: number;
  end: number;
  type: 'bold' | 'italic' | 'code' | 'link' | 'strikethrough' | 'highlight';
  data?: { url?: string; color?: string };
}

export interface FormattedText {
  plainText: string;
  formats: TextFormat[];
  markdown: string;
  html: string;
}

class RichTextFormatter {
  /**
   * Apply formatting to selected text
   */
  static applyFormat(
    text: string,
    selection: { start: number; end: number },
    formatType: TextFormat['type'],
    data?: TextFormat['data']
  ): FormattedText {
    const { start, end } = selection;
    const selectedText = text.substring(start, end);

    let formatted = '';
    let markdown = '';

    switch (formatType) {
      case 'bold':
        formatted = `**${selectedText}**`;
        break;
      case 'italic':
        formatted = `*${selectedText}*`;
        break;
      case 'code':
        formatted = `\`${selectedText}\``;
        break;
      case 'link':
        formatted = `[${selectedText}](${data?.url || 'https://'})`;
        break;
      case 'strikethrough':
        formatted = `~~${selectedText}~~`;
        break;
      case 'highlight':
        formatted = `<mark style="background-color:${data?.color || '#FFFF00'}">${selectedText}</mark>`;
        break;
    }

    const newText = text.substring(0, start) + formatted + text.substring(end);
    markdown = this.toMarkdown(newText);
    const html = this.markdownToHtml(markdown);

    return {
      plainText: newText,
      formats: this.extractFormats(newText),
      markdown,
      html,
    };
  }

  /**
   * Convert text to markdown
   */
  static toMarkdown(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  }

  /**
   * Convert markdown to HTML
   */
  static markdownToHtml(markdown: string): string {
    let html = markdown;

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-800 px-1 rounded">$1</code>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto"><code>$1</code></pre>');

    // Links
    html = html.replace(/\[(.*?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">$1</a>');

    // Lists
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul class="list-disc list-inside">$1</ul>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    return html;
  }

  /**
   * Extract all formats from text
   */
  static extractFormats(text: string): TextFormat[] {
    const formats: TextFormat[] = [];

    // Bold
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      formats.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'bold',
      });
    }

    // Italic
    const italicRegex = /\*(.*?)\*/g;
    while ((match = italicRegex.exec(text)) !== null) {
      formats.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'italic',
      });
    }

    // Code
    const codeRegex = /`(.*?)`/g;
    while ((match = codeRegex.exec(text)) !== null) {
      formats.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'code',
      });
    }

    // Links
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    while ((match = linkRegex.exec(text)) !== null) {
      formats.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'link',
        data: { url: match[2] },
      });
    }

    return formats;
  }

  /**
   * Get formatting at position
   */
  static getFormatAtPosition(text: string, position: number): TextFormat[] {
    const formats = this.extractFormats(text);
    return formats.filter((f) => position >= f.start && position <= f.end);
  }

  /**
   * Remove formatting
   */
  static removeFormat(text: string, selection: { start: number; end: number }): string {
    const { start, end } = selection;
    const selectedText = text.substring(start, end);

    // Remove any markdown formatting
    let cleaned = selectedText
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1');

    return text.substring(0, start) + cleaned + text.substring(end);
  }
}

export default RichTextFormatter;